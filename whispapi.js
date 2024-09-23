const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Get the input file path from command-line arguments
const filePath = process.argv[2];

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

const ext = path.extname(filePath).toLowerCase();

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
  output: 'txt', // Request only TXT output
};

// Prepare Axios request configuration
const config = {
  method: 'post',
  url: 'http://whispapi:9000/asr',
  headers: {
    ...formData.getHeaders(),
  },
  params: params,
  data: formData,
  responseType: 'text', // Handle response as text
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
};

axios(config)
  .then((response) => {
    const contentType = response.headers['content-type'];
    const baseName = path.basename(filePath, path.extname(filePath));
    const dirName = path.dirname(filePath);

    // Log the response status and headers for debugging
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    // Response data is a string
    console.log('Response Data:', response.data);

    // Save the transcription
    const outputFilename = path.join(dirName, `${baseName}.txt`);
    fs.writeFileSync(outputFilename, response.data, 'utf8');
    console.log(`Transcription saved to ${outputFilename}`);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    if (error.response && error.response.data) {
      console.error('Response data:', error.response.data);
    }
  });
