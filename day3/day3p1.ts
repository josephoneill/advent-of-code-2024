import * as fs from "fs";
import path from "path";

const rawInput = fs.readFileSync(
  path.resolve(__dirname, "./input.txt"),
  "utf-8"
);
// Match exactly mul(xyz,xyz), where xyz is a number from 1 to 3 digits
const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;

const validInstructions = rawInput.match(regex);
let sum = 0;

if (validInstructions) {
  validInstructions.forEach((instruction: string) => {
    const product = instruction
      .substring(instruction.indexOf("(") + 1, instruction.indexOf(")"))
      .split(",")
      .map((num) => parseInt(num, 10))
      .reduce((acc, num) => acc * num, 1);

    sum += product;
  });
}

console.log(`The solution is ${sum}`);
