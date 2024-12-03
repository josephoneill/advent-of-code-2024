import * as fs from "fs";
import path from "path";

const rawInput = fs.readFileSync(
  path.resolve(__dirname, "./input.txt"),
  "utf-8"
);
// Match exactly mul(xyz,xyz), where xyz is a number from 1 to 3 digits
// For part 2, add the additional matchings of do() and dont()
const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don't\(\)/g;

const validInstructions: string[] | null = rawInput.match(regex);
let instructionsEnabled = true;
let sum = 0;

if (validInstructions) {
  for (const instruction of validInstructions) {
    if (instruction.includes('mul')) {
      if (!instructionsEnabled) continue;

      const product = instruction
        .substring(instruction.indexOf("(") + 1, instruction.indexOf(")"))
        .split(",")
        .map((num) => parseInt(num, 10))
        .reduce((acc, num) => acc * num, 1);

      sum += product;
    } else {
      instructionsEnabled = instruction === 'do()';
    }
  }
}

console.log(`The solution is ${sum}`);
