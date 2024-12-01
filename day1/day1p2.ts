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

const map = new Map();
let sum = 0;

l1.forEach((num) => {
  if (map.has(num)) {
    map.set(num, map.get(num) + 1);
  } else {
    map.set(num, 1);
  }
});

l2.forEach((num) => {
  if (map.has(num)) {
    sum += num * map.get(num);
  }
});

console.log(`The solution is ${sum}`);