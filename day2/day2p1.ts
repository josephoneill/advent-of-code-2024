import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray = rawInput.split(/[\r\n]+/);

let validCount = 0;

for (let i = 0; i < inputArray.length; i++) {
  const line = inputArray[i];
  const levels = line.split(' ').map((level: string) => parseInt(level, 10));

  const isIncreasing = levels[0] < levels[1];

  for (let j = 1; j < levels.length; j++) {
    if (Math.abs(levels[j] - levels[j-1]) > 3 || (isIncreasing && levels[j] <= levels[j-1]) || (!isIncreasing && levels[j] >= levels[j-1])) {
      break;
    }

    // If we reached the end of the level, it is valid
    if (j === levels.length - 1) {
      validCount++;
    }
  }
}

console.log(`The solution is ${validCount}`);