import * as fs from 'fs';
import path from 'path';

class Position {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  distanceTo(p: Position): { dx: number, dy: number } {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return { dx, dy };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Node {
  frequency: string;
  isAntinode: boolean;
  position: Position;

  constructor(frequency = '', position = new Position) {
    this.frequency = frequency;
    this.position = position;
    this.isAntinode = false;
  }
}

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray: string[] = rawInput.split(/[\r\n]+/);

const grid: Array<Array<Node>> = [];
const map: Map<string, Node[]> = new Map();
let width = inputArray[0].length;
let height = inputArray.length;
let count = 0;

const isYWithinBounds = (y: number) =>
  y >= 0 && y < height

const isXWithinBounds = (x: number) =>
  x >= 0 && x < width;

function isWithinBounds(p: Position) {
  return (
    isXWithinBounds(p.x) &&
    isYWithinBounds(p.y)
  );
}

for (let i = 0; i < inputArray.length; i++) {
  grid.push(inputArray[i].split('').map((x, j) => {
    const node = new Node(x, new Position(j, i));

    if (x !== '.') {
      if (map.has(x)) {
        map.get(x)!.push(node);
      } else {
        map.set(x, [node]);
      }
    }

    return node;
  }));
}

for (const frequency of map.keys()) {
  const frequencyNodes = map.get(frequency)!;

  if (frequencyNodes.length < 2) continue;

  for (let i = 0; i < frequencyNodes.length; i++) {
    const nodeA = frequencyNodes[i];
    for (let j = i + 1; j < frequencyNodes.length; j++) {
      const nodeB = frequencyNodes[j];

      const { dx, dy } = nodeA.position.distanceTo(nodeB.position);

      projectAntinode(nodeA.position, dx, dy);
    }
  }
}
function projectAntinode(startPosition: Position, xStep: number, yStep: number) {
  let { x, y } = startPosition;

  while (isWithinBounds(new Position(x, y))) {
    x -= xStep;
    y -= yStep;
  }

  x += xStep;
  y += yStep;

  while (isWithinBounds(new Position(x, y))) {
    if (!grid[y][x].isAntinode) {
      grid[y][x].isAntinode = true;
      count++;
    }

    x += xStep;
    y += yStep;
  }
}


function printGrid() {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].map(x => x.isAntinode ? (x.frequency !== '.' ? x.frequency : '#') : x.frequency).join(''));
  }
}

console.log(`The solution is ${count}`);