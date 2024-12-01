import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray = rawInput.split(/[\r\n]+/);

const l1: number[] = [];
const l2: number[] = [];

for (let i = 0; i < inputArray.length; i++) {
  const line = inputArray[i];
  const locations = line.split(/\s+/);
  
  l1.push(parseInt(locations[0], 10));
  l2.push(parseInt(locations[1], 10));
}

l1.sort();
l2.sort();

const sum = l1.reduce((acc, curr, i) => acc + Math.abs(curr - l2[i]), 0);

console.log(`The solution is ${sum}`);