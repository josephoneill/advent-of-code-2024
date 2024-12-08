import * as fs from "fs";
import path from "path";

enum Direction {
  UP = 1,
  RIGHT,
  DOWN,
  LEFT
};

class Location {
  obstruction: boolean;
  location: Position;
  visited: boolean;

  constructor(obstruction: boolean, x: number, y: number) {
    this.obstruction = obstruction;
    this.location = { x, y };
    this.visited = false;
  }

  setVisited(visited: boolean) {
    this.visited = visited;
  }
}

type Position = {
  x: number;
  y: number;
}

class Guard {
  position: Position;
  direction: Direction;

  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    
    this.direction = Direction.UP;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  updateDirection() {
    this.direction = ((this.direction % 4) + 1) as Direction;
  }
}

const rawInput = fs.readFileSync(
  path.resolve(__dirname, "./input.txt"),
  "utf-8"
);

const inputArray = rawInput.split(/[\r\n]+/);
const guard = new Guard();
const obstructionMapRow = new Map<number, Location[]>();
const obstructionMapCol = new Map<number, Location[]>();
const grid: Array<Array<Location>> = [];
let height = inputArray.length;
let width = inputArray[0].length;

function isInBounds(position: Position) {
  return (
    position.x >= 0 &&
    position.x < width &&
    position.y >= 0 &&
    position.y < height
  );
}

let count = 0;

for (let y = 0; y < inputArray.length; y++) {
  grid.push([]);
  const line = inputArray[y];

  for (let x = 0; x < line.length; x++) {
    const item = line[x];
    const isObstruction = item === '#';
    const location = new Location(isObstruction, x, y);

    if (item === '^') {
      guard.setPosition(x, y);
    }

    if (isObstruction) {
      updateObstructionMap(obstructionMapCol, x, location);
      updateObstructionMap(obstructionMapRow, y, location);
    }

    grid[y].push(location);
  }
}

while (
  isInBounds(guard.position)
) {
  let x = guard.position.x;
  let y = guard.position.y;

  while (isInBounds({ x, y }) && !grid[y][x].obstruction) {
    if (!grid[y][x].visited) {
      grid[y][x].visited = true;
      count++;
    }

    guard.setPosition(x, y);

    switch (guard.direction) {
      case Direction.UP:
        y--;
        break;
      case Direction.RIGHT:
        x++;
        break;
      case Direction.DOWN:
        y++;
        break;
      case Direction.LEFT:
        x--;
        break;
    }
  }

  if (!isInBounds({ x, y })) {
    break;
  }

  // We've hit an obstruction
  guard.updateDirection();
}

function updateObstructionMap(obstructionMap: Map<number, Location[]>, coordinate: number, location: Location) {
  if (obstructionMap.has(coordinate)) {
    obstructionMap.get(coordinate)!.push(location);
  } else {
    obstructionMap.set(coordinate, [location]);
  }
}

console.log(`The solution is ${count}`);
