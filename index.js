#!/usr/bin/env node
// cli.js

import { whispapi } from './bin/whispapi.js';
import process from 'process';
import path from 'path';

/**
 * Parses command-line arguments and returns an object with options.
 *
 * @returns {Object} - Parsed arguments.
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    filePath: null,
    format: 'txt',
    language: 'en',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-f':
      case '--format':
        if (args[i + 1]) {
          options.format = args[i + 1].toLowerCase();
          i++;
        } else {
          console.error('Error: Format not specified after -f or --format flag.');
          process.exit(1);
        }
        break;
      case '-l':
      case '--language':
        if (args[i + 1]) {
          options.language = args[i + 1].toLowerCase();
          i++;
        } else {
          console.error('Error: Language code not specified after -l or --language flag.');
          process.exit(1);
        }
        break;
      default:
        if (!options.filePath) {
          options.filePath = arg;
        }
        break;
    }
  }

  if (!options.filePath) {
    console.error('Usage: whispapi <file_path> [-f format] [-l language]');
    process.exit(1);
  }

  return options;
}

/**
 * Main function to execute the CLI tool.
 */
async function main() {
  const { filePath, format, language } = parseArguments();

  try {
    await whispapi(filePath, format, language);
  } catch (error) {
    console.error('Transcription failed:', error.message);
    process.exit(1);
  }
}

main();
