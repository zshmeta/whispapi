// bin/whispapi.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { spinnit } from 'spinnit';

/**
 * Transcribes an audio or video file using the WhispAPI.
 *
 * @param {string} filePath - The path to the audio or video file to transcribe.
 * @param {string} [format='txt'] - The desired output format ('txt', 'json', 'srt', 'vtt').
 * @param {string} [language='en'] - The language code for transcription.
 * @returns {Promise<string>} - Resolves with the transcription text.
 */
export async function whispapi(filePath, format = 'txt', language = 'en') {
  // Define supported extensions and formats
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.opus', '.aac'];
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.webm', '.wmv'];
  const allowedFormats = ['txt', 'json', 'srt', 'vtt'];
  const ext = path.extname(filePath).toLowerCase();

  // Validate file path
  if (!filePath) {
    throw new Error('File path is required.');
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Check file type
  if (!audioExtensions.includes(ext) && !videoExtensions.includes(ext)) {
    throw new Error('File is neither audio nor video.');
  }

  // Validate format
  if (!allowedFormats.includes(format)) {
    throw new Error(`Invalid format specified. Allowed formats are: ${allowedFormats.join(', ')}`);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('audio_file', fs.createReadStream(filePath));

  // Set query parameters
  const params = {
    encode: true,
    task: 'transcribe',
    word_timestamps: false,
    output: format, // Request the specified output format
    language: language
  };

  // Prepare Axios request configuration
  const config = {
    method: 'post',
    url: 'http://whispapi/asr',
    headers: {
      ...formData.getHeaders(),
    },
    params: params,
    data: formData,
    responseType: 'text', // Handle response as text
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  try {
    // Inform the user that the transcription process has started
    console.log('Whispering... please wait, this can take some time...');
    const equationSpinner = spinnit({ spinner: 'equation', speed: 200 });
    equationSpinner.start();

    // we replace the console log to hide any message from the first one
    const originalConsoleLog = console.log;
    console.log = () => {};

    // Make the API request
    const response = await axios(config);

    // Stop the spinner
    equationSpinner.stop(true);
    // show back the original logs
    console.log = originalConsoleLog;
    console.log('');
    console.log('');

    // Extract base name and directory
    const baseName = path.basename(filePath, path.extname(filePath));
    const dirName = path.dirname(filePath);

    // Log the response data
    console.log(response.data);

    // Save the transcription
    const outputFilename = path.join(dirName, `${baseName}.${format}`);
    fs.writeFileSync(outputFilename, response.data, 'utf8');
    console.log(`Transcription saved to ${outputFilename}`);

    // Return the transcription data
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response && error.response.data) {
      console.error('Response data:', error.response.data);
    }
    throw error; // Re-throw the error for upstream handling
  }
}


export default whispapi;