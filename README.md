# WhispAPI

WhispAPI is a versatile Node.js tool that allows you to transcribe audio and video files using the WhispAPI service. It can be used both as a Command-Line Interface (CLI) tool and as a reusable module in other Node.js applications. Whether you're a developer looking to integrate transcription capabilities into your app or a user needing a quick transcription tool from the terminal, WhispAPI has you covered.

## Table of Contents

- [WhispAPI](#whispapi)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Install via npm or Bun](#install-via-npm-or-bun)
    - [Install from Source](#install-from-source)
  - [Usage](#usage)
    - [As a CLI Tool](#as-a-cli-tool)
      - [Basic Usage](#basic-usage)
      - [Specifying Output Format](#specifying-output-format)
      - [Specifying Language](#specifying-language)
      - [Full Example](#full-example)
    - [As a Module](#as-a-module)
      - [Installation](#installation-1)
      - [Importing and Using WhispAPI](#importing-and-using-whispapi)
      - [Example](#example)
  - [API Reference](#api-reference)
    - [whispapi(filePath, format, language)](#whispapifilepath-format-language)
      - [Parameters](#parameters)
      - [Returns](#returns)
      - [Errors](#errors)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Dual Functionality:** Use WhispAPI as a CLI tool or integrate it as a module in your applications.
- **Flexible Output Formats:** Supports multiple transcription output formats including `txt`, `json`, `srt`, and `vtt`.
- **Language Support:** Specify the language for transcription.
- **Spinner Feedback:** Provides visual feedback during the transcription process using a spinner.
- **Error Handling:** Gracefully handles errors and provides informative messages.

## Installation

### Prerequisites

- **Node.js:** Ensure you have Node.js (version 14 or later) installed. You can download it from the [Node.js Official Website](https://nodejs.org/).
- **Bun (Optional):** If you prefer using Bun, ensure it's installed. You can get it from the [Bun Official Website](https://bun.sh/).

### Install via npm or Bun

You can install WhispAPI globally using npm or Bun to use it as a CLI tool:

#### Using npm:

```bash
npm install -g whispapi
```

#### Using Bun:

```bash
bun install -g whispapi
```

> **Note:** Ensure that the package name `whispapi` is correctly published to npm or Bun registry. Replace it if it's different.

### Install from Source

Alternatively, clone the repository and install dependencies locally:

```bash
git clone https://github.com/yourusername/whispapi.git
cd whispapi
npm install
```

## Usage

WhispAPI can be used in two primary ways:

1. **As a CLI Tool:** Transcribe files directly from the terminal.
2. **As a Module:** Integrate transcription functionality into your Node.js applications.

### As a CLI Tool

After installing WhispAPI globally, you can use the `whispapi` command in your terminal.

#### Basic Usage

Transcribe an audio or video file and save the transcription in the default `txt` format.

```bash
whispapi /path/to/audio_or_video_file.mp3
```

#### Specifying Output Format

Use the `-f` or `--format` flag to specify the desired output format. Supported formats are `txt`, `json`, `srt`, and `vtt`.

```bash
whispapi -f json /path/to/file.mp3 
```

#### Specifying Language

Use the `-l` or `--language` flag to specify the language code for transcription. The default language is English (`en`).

```bash
whispapi /path/to/file.mp3 -l es
```

#### Full Example

Transcribe a file in Spanish and save the output in JSON format.

```bash
whispapi /path/to/file.mp3 -f json -l es
```

**Output:**

```
whispering... please wait, this can take some time...
{
  "transcription": "Hola, este es un ejemplo de transcripción."
}
Transcription saved to /path/to/file.json
```

### As a Module

WhispAPI can be imported and used in your Node.js applications to add transcription capabilities.

#### Installation

If you haven't already, install WhispAPI in your project directory:

```bash
npm install whispapi
```

Or using Bun:

```bash
bun add whispapi
```

> **Note:** Ensure that the package name `whispapi` is correctly published to npm or Bun registry. Replace it if it's different.

#### Importing and Using WhispAPI

Import the `whispapi` function from the module and use it with the required parameters.

#### Example

```javascript
// anotherApp.js
import { whispapi } from 'whispapi'; // Adjust the import path as needed

async function transcribeFile() {
  const filePath = '/path/to/audio_or_video_file.mp3';
  const format = 'json'; // Optional: 'txt', 'json', 'srt', 'vtt'
  const language = 'en'; // Optional: language code

  try {
    const transcription = await whispapi(filePath, format, language);
    console.log('Transcription:', transcription);
  } catch (error) {
    console.error('Error during transcription:', error.message);
  }
}

transcribeFile();
```

**Running the Example:**

```bash
node anotherApp.js
```

**Output:**

```
whispering... please wait, this can take some time...
{
  "transcription": "Hello, this is an example of transcription."
}
Transcription saved to /path/to/file.json
Transcription: {
  "transcription": "Hello, this is an example of transcription."
}
```

## API Reference

### `whispapi(filePath, format, language)`

Transcribes an audio or video file using the WhispAPI service.

#### Parameters

- `filePath` _(string)_: **Required.** The path to the audio or video file to transcribe.
- `format` _(string)_: **Optional.** The desired output format. Supported formats:
  - `'txt'` (default)
  - `'json'`
  - `'srt'`
  - `'vtt'`
- `language` _(string)_: **Optional.** The language code for transcription. Default is `'en'` (English).

#### Returns

- _(Promise<string>)_: Resolves with the transcription text/content.

#### Errors

Throws an error if:

- `filePath` is not provided.
- The file does not exist.
- The file is neither audio nor video based on its extension.
- An invalid `format` is specified.
- The transcription API request fails.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository:** Click the "Fork" button at the top-right corner of the repository page.
2. **Clone Your Fork:** 

   ```bash
   git clone https://github.com/yourusername/whispapi.git
   cd whispapi
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes:** Implement your feature or bug fix.

5. **Commit Your Changes:**

   ```bash
   git commit -m "Add feature: your feature description"
   ```

6. **Push to Your Fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request:** Navigate to the original repository and click on "New Pull Request."

**Please ensure that your code follows the project's coding standards and includes appropriate documentation.**

## License

This project is licensed under the [MIT License](LICENSE).
