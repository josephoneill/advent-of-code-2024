import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray = rawInput.split(/[\r\n]+/);

let validCount = 0;

for (let i = 0; i < inputArray.length; i++) {
  const line = inputArray[i];
  const levels = line.split(' ').map((level: string) => parseInt(level, 10));

  if (isValid(levels)) {
    validCount++;
  } else {
    for (let j = 0; j < levels.length; j++) {
      const copy = [...levels];
      copy.splice(j, 1);
      if (isValid(copy)) {
        validCount++;
        break;
      }
    }
  }
}

function isValid(levels: number[]) {
  const isIncreasing = levels[0] < levels[1];

  for (let j = 1; j < levels.length; j++) {
    if (Math.abs(levels[j] - levels[j-1]) > 3 || (isIncreasing && levels[j] <= levels[j-1]) || (!isIncreasing && levels[j] >= levels[j-1])) {
      return false;
    }
  }

  return true;
}

console.log(`The solution is ${validCount}`);