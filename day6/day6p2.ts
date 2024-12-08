import * as fs from "fs";
import path from "path";

enum Direction {
  UP = 1,
  RIGHT,
  DOWN,
  LEFT
};

function iterateDirection(startingDirection: Direction): Direction {
  return ((startingDirection % 4) + 1) as Direction;
}

class Location {
  obstruction: boolean;
  position: Position;
  visited: boolean;
  visitedDirections: Set<Direction>;

  constructor(obstruction: boolean, x: number, y: number) {
    this.obstruction = obstruction;
    this.position = { x, y };
    this.visited = false;
    this.visitedDirections = new Set();
  }

  setVisited(visited: boolean) {
    this.visited = visited;
  }

  addVisitedDirection(direction: Direction) {
    this.visitedDirections.add(direction);
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
    this.direction = iterateDirection(this.direction);
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
    // We need to check possible obstruction
    if (obstructionExists(x, y, iterateDirection(guard.direction))) {
      console.log(x, y, Direction[guard.direction]);
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
  
  // We've hit an obstruction, log the direction we hit it with
  grid[y][x].addVisitedDirection(guard.direction);

  guard.updateDirection();
}

function updateObstructionMap(obstructionMap: Map<number, Location[]>, coordinate: number, location: Location) {
  if (obstructionMap.has(coordinate)) {
    obstructionMap.get(coordinate)!.push(location);
  } else {
    obstructionMap.set(coordinate, [location]);
  }
}

function obstructionExists(x: number, y: number, direction: Direction) {
  const scanVertical = (direction === Direction.UP || direction === Direction.DOWN);
  const obstructionMap = scanVertical ? obstructionMapCol : obstructionMapRow;
  const coordinate =  scanVertical ? x : y;
  const obstructions = obstructionMap.get(coordinate);
  if (!obstructions) return false;

  switch (direction) {
    case Direction.UP:
      return obstructions.some(location => location.position.y < y && location.visitedDirections.has(direction));
    case Direction.RIGHT:
      return obstructions.some(location => location.position.x > x && location.visitedDirections.has(direction));
    case Direction.DOWN:
      return obstructions.some(location => location.position.y > y && location.visitedDirections.has(direction));
    case Direction.LEFT:
      return obstructions.some(location => location.position.x < x && location.visitedDirections.has(direction));
  }
}

console.log(`The solution is ${count}`);
