import * as fs from 'fs';
import * as path from 'path';

// Resolve path from project root
// __dirname will be dist/src/utils/, so we need to go up 3 levels
const projectRoot = path.join(__dirname, '../../..');
const hataMesaji = fs
  .readFileSync(path.join(projectRoot, 'hataMesaji.txt'))
  .toString()
  .split('\r\n');

export default (): string => hataMesaji[Math.floor(Math.random() * hataMesaji.length)];
export { hataMesaji as errorMessages };
