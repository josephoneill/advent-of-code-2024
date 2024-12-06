import * as fs from "fs";
import path from "path";

const rawInput = fs.readFileSync(
  path.resolve(__dirname, "./input.txt"),
  "utf-8"
);

const [rules, updates]: string[] = rawInput.split(/\n\s*\n/);
const rulesArray = rules.trim().split(/[\r\n]+/);
const updatesArray = updates.trim().split(/[\r\n]+/);
const map = new Map<string, string[]>();

let sum = 0;

for (let i = 0; i < rulesArray.length; i++) {
  const line = rulesArray[i];
  const [beforePage, referencePage] = line.split('|');

  // Create array of the prereqs for a given page
  if (map.has(referencePage)) {
    map.get(referencePage)!.push(beforePage);
  } else {
    map.set(referencePage, [beforePage]);
  }
}

for (let i = 0; i < updatesArray.length; i++) {
  const currUpdates = updatesArray[i].split(',');
  const pendingUpdatesSet = new Set([...currUpdates]);
  const middlePage = parseInt(currUpdates[Math.floor(currUpdates.length / 2)]);

  for (let j = 0; j < currUpdates.length - 1; j++) {
    const page = currUpdates[j];
    // Delete the current item from our pending updates set
    pendingUpdatesSet.delete(page);

    // If there are no prereqs, page update is valid, otherwise, encapsulate prereqs logic here
    if (map.has(page)) {
      // Get the list of pre-reqs for our current update
      const prereqs = map.get(page)!;
      // Check if any of the pending updates exists in our prereqs
      // If so, our updates cannot be valid, and break the current loop
      if (prereqs.some(prereqPage => pendingUpdatesSet.has(prereqPage))) {
        break;
      }

      // If we reach the end of the array, update is valid
      if (j === currUpdates.length - 2) {
        sum += middlePage;
      }
    }
  } 
}

console.log(`The solution is ${sum}`);
