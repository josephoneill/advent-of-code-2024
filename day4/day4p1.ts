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
let wordSearch: Array<Array<string>> = [];
let count = 0;

for (let i = 0; i < inputArray.length; i++) {
  wordSearch.push(inputArray[i].split(''));
}

for (let i = 0; i < wordSearch.length; i++) {
  const line = wordSearch[i];
  for (let j = 0; j < line.length; j++) {
    count += isWordValid(i, j, wordSearch, Direction.Down) ? 1 : 0;
    count += isWordValid(i, j, wordSearch, Direction.Right) ? 1 : 0;
    count += isWordValid(i, j, wordSearch, Direction.LeftDiagonal) ? 1 : 0;
    count += isWordValid(i, j, wordSearch, Direction.RightDiagonal) ? 1 : 0;
  }
}

// Note: x and y here are flipped due lack to attention of detail
// The problem still solves correctly, but the directions aren't correct
function isWordValid(x: number, y: number, wordSearch: Array<Array<string>>, direction: Direction) {
  let word = "";
  switch (direction) {
    case Direction.Down:
      if (y > wordSearch.length - desiredWordLength) {
        break;
      }

      word = `${wordSearch[x][y]}${wordSearch[x][y+1]}${wordSearch[x][y+2]}${wordSearch[x][y+3]}`;
      break;
    case Direction.Right:
      if (x > wordSearch[0].length - desiredWordLength) {
        break;
      }

      word = `${wordSearch[x][y]}${wordSearch[x+1][y]}${wordSearch[x+2][y]}${wordSearch[x+3][y]}`;
      break;
    case Direction.LeftDiagonal:
      if (y > wordSearch.length - desiredWordLength || x < desiredWordLength - 1) {
        break;
      }
      word = `${wordSearch[x][y]}${wordSearch[x-1][y+1]}${wordSearch[x-2][y+2]}${wordSearch[x-3][y+3]}`;
      break;
    case Direction.RightDiagonal:
      if (y > wordSearch.length - desiredWordLength || x > wordSearch[0].length - desiredWordLength) {
        break;
      }
      word = `${wordSearch[x][y]}${wordSearch[x+1][y+1]}${wordSearch[x+2][y+2]}${wordSearch[x+3][y+3]}`;
      break;
  }
  
  return word === 'XMAS' || word.split('').reverse().join('') === 'XMAS';
}

console.log(`The solution is ${count}`);
