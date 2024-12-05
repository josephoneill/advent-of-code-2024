import * as fs from "fs";
import path from "path";

enum Direction {
  Down,
  Right,
  LeftDiagonal,
  RightDiagonal
}

const desiredWordLength = 4;

const rawInput = fs.readFileSync(
  path.resolve(__dirname, "./input.txt"),
  "utf-8"
);

const inputArray: string[] = rawInput.split(/[\r\n]+/);
const map = new Map();
let wordSearch: Array<Array<string>> = [];
let count = 0;

for (let i = 0; i < inputArray.length; i++) {
  const lineArr: Array<string> = [];
  const aIndexes: Array<number> = [];
  const line = inputArray[i];
  line.split('').forEach((letter, j) => {
    lineArr.push(letter);
    if (letter === 'A') {
      aIndexes.push(j);
    }
  });
  wordSearch.push(lineArr);
  map.set(i, aIndexes);
}

for (let i = 1; i < wordSearch.length - 1; i++) {
  const aIndexes = map.get(i);

  for (const aIndex of aIndexes) {
    count += isValidXMas(aIndex, i, wordSearch) ? 1 : 0;
  }
}

function isValidXMas(y: number, x: number, wordSearch: Array<Array<string>>) {
  // If our center point, A, is at an edge, cannot be valid
  if (x === 0 || x === wordSearch[0].length - 1 || y === 0 || y === wordSearch.length - 1) return false;

  const leftDiagonal = `${wordSearch[x-1][y-1]}${wordSearch[x][y]}${wordSearch[x+1][y+1]}`;
  const rightDiagonal = `${wordSearch[x-1][y+1]}${wordSearch[x][y]}${wordSearch[x+1][y-1]}`;

  return (leftDiagonal === 'MAS' || leftDiagonal === 'SAM') && (rightDiagonal === 'MAS' || rightDiagonal === 'SAM');
}

console.log(`The solution is ${count}`);
