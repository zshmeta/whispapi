import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import process from 'process';

// Function to handle the transcription process
export function whispapi() {
  // Get the input file path from command-line arguments
  const filePath = process.argv[process.argv.length - 1];

  if (!filePath) {
    console.error('Usage: node transcribe.js <file_path>');
    process.exit(1);
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  // Determine if the file is audio or video based on its extension
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.opus', '.aac'];
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.webm', '.wmv'];
  const allowedFormats = ['txt', 'json', 'srt', 'vtt'];
  const ext = path.extname(filePath).toLowerCase();

  // Default format
  let format = 'txt';

  // Parse command-line arguments
  const args = process.argv.slice(2);
  const formatIndex = args.indexOf('-f');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    const userFormat = args[formatIndex + 1];
    if (allowedFormats.includes(userFormat)) {
      format = userFormat;
    } else {
      console.error(`Invalid format specified. Allowed formats are: ${allowedFormats.join(', ')}`);
      process.exit(1);
    }
  }

  if (!audioExtensions.includes(ext) && !videoExtensions.includes(ext)) {
    console.error('File is neither audio nor video');
    process.exit(1);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('audio_file', fs.createReadStream(filePath));

  // Set query parameters
  const params = {
    encode: true,
    task: 'transcribe',
    language: 'en', // Set your desired language code
    word_timestamps: false,
    output: format, // Request the specified output format
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

  // inform the user that the transcription process has started
  console.log('whispering... please wait, this can take some time...');

  axios(config)
    .then((response) => {
      const baseName = path.basename(filePath, path.extname(filePath));
      const dirName = path.dirname(filePath);
      // Response data is a string
      console.log(response.data);

      // Save the transcription
      const outputFilename = path.join(dirName, `${baseName}.${format}`);
      fs.writeFileSync(outputFilename, response.data, 'utf8');
      console.log(`Transcription saved to ${outputFilename}`);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      if (error.response && error.response.data) {
        console.error('Response data:', error.response.data);
      }
    });
}