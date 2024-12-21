import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray: string[] = rawInput.split(/[\r\n]+/);
let topologyMatrix: Array<Array<number>> = [];
const trailheadIndices: Position[] = [];
let sum = 0;
let width = inputArray[0].length;
let height = inputArray.length;

type Position = {
  x: number;
  y: number;
}

for (let y = 0; y < inputArray.length; y++) {
  topologyMatrix.push([]);
  for (let x = 0; x < inputArray[y].length; x++) {
    topologyMatrix[y].push(parseInt(inputArray[y][x], 10));
    if (inputArray[y][x] === '0') {
      trailheadIndices.push({ x, y });
    }
  }
}

function scanTrail(startElevation: number, startPosition: Position) {
  let total = 0;

  const { x, y } = startPosition;

  if (
    x < 0 ||
    x > width - 1 ||
    y < 0 ||
    y > height - 1
  ) {
    return 0;
  }

  // Base case
  if (topologyMatrix[y][x] === 9) {
    return 1;
  }

  // Left
  if (x > 0 && topologyMatrix[y][x-1] === startElevation+1) {
    total += scanTrail(startElevation+1, { y, x: x-1 });
  }

  // Right
  if (x < width - 1 && topologyMatrix[y][x+1] === startElevation+1) {
    total += scanTrail(startElevation+1, { y, x: x+1 });
  }

  // Up
  if (y > 0 && topologyMatrix[y-1][x] === startElevation+1) {
    total += scanTrail(startElevation+1, { y: y-1, x: x });
  }

  // Down
  if (y < height - 1 && topologyMatrix[y+1][x] === startElevation+1) {
    total += scanTrail(startElevation+1, { y: y+1, x: x });
  }

  return total;
}

for (const position of trailheadIndices) {
  sum += scanTrail(0, position);
}

console.log(`The solution is ${sum}`);