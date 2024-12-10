import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray: string[] = rawInput.split(/[\r\n]+/);

function possibleValidEquation(currVal: number, numbers: number[], index: number, targetVal: number): boolean {
  // Base case
  if (index === numbers.length) {
    return currVal === targetVal;
  }

  // Added for efficiency. Negative numbers do not exist in our dataset, thus if we exceed targetVal
  // we cannot possible continue and find a correct equation
  if (currVal > targetVal) {
    return false;
  }

  const nextNumber = numbers[index];
  const sum = currVal + nextNumber;
  const product = currVal * nextNumber;

  return possibleValidEquation(sum, numbers, index + 1, targetVal) || possibleValidEquation(product, numbers, index + 1, targetVal);
}

let sum = 0;

for (let i = 0; i < inputArray.length; i++) {
  const line = inputArray[i];

  const [targetValString, numbersString] = line.split(':').map(x => x.trim());
  const targetVal = parseInt(targetValString, 10);
  const numbers: number[] = numbersString.split(' ').map(x => parseInt(x, 10));
  const startingValue = numbers.shift()!;

  if (possibleValidEquation(startingValue, numbers, 0, targetVal)) {
    sum += targetVal;
  }
}

console.log(`The solution is ${sum}`);