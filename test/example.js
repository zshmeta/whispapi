import whispapi from '../index.js'


const filePath = 'test/test.mp3'
const format = 'txt'

const testResult = whispapi(filePath, format)


console.log(testResult)