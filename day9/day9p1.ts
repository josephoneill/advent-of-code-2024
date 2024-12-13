import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray: string[] = rawInput.split(/[\r\n]+/);
let sum = 0;
const diskMap: number[] = [];

for (let i = 0; i < inputArray.length; i++) {
  for (let j = 0; j < inputArray[i].length; j += 2) {
    const chunk: number[] = inputArray[i].slice(j, j + 2).split('').map(x => parseInt(x, 10));
    const id = j / 2;
    diskMap.push(...Array(chunk[0]).fill(id));

    if (chunk[1]) {
      diskMap.push(...Array(chunk[1]).fill(-1))
    }
  }
}

let l = 0;
let r = diskMap.length - 1;

while (l < r) {
  // Iterate left pointer until it reaches a free space
  while (diskMap[l] !== -1) {
    l++;
  }

  // Iterate right pointer until it reaches a block
  while (diskMap[r] === -1) {
    r--;
  }

  // Break if, while iterating, we no longer meet l < r
  if (l >= r) break;

  // Set the free space to the rightmost block
  diskMap[l] = diskMap[r];
  // Replace rightmost block with -1
  diskMap[r] = -1;
}

let i = 0;
while (diskMap[i] !== -1) {
  sum += (i * diskMap[i]);
  i++;
}

console.log(`The solution is ${sum}`);