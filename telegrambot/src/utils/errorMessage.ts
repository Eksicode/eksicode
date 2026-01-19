import * as fs from 'fs';
import * as path from 'path';

// Resolve path to telegrambot directory
// When running with ts-node: __dirname = telegrambot/src/utils
// When compiled: __dirname = telegrambot/dist/src/utils
// We need to go up to telegrambot directory
const telegrambotDir = __dirname.includes('dist') 
  ? path.join(__dirname, '../../..')  // dist/src/utils -> telegrambot
  : path.join(__dirname, '../..');    // src/utils -> telegrambot

const hataMesajiPath = path.join(telegrambotDir, 'hataMesaji.txt');
const hataMesaji = fs
  .readFileSync(hataMesajiPath)
  .toString()
  .split('\r\n');

export default (): string => hataMesaji[Math.floor(Math.random() * hataMesaji.length)];
export { hataMesaji as errorMessages };
