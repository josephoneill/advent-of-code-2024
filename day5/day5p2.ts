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
  let valid = true;

  for (let j = 0; j < currUpdates.length - 1; j++) {
    const page = currUpdates[j];
    // Delete the current item from our pending updates set
    pendingUpdatesSet.delete(page);

    // Continue loop if current page update is valid
    if (!map.has(page)) continue;

    // Get the list of pre-reqs for our current update
    const prereqs = map.get(page)!;

    // Search for the first prereq
    const firstPrereq = prereqs.find(prereqPage => pendingUpdatesSet.has(prereqPage));

    // No found prereq means update is valid
    if (!firstPrereq) continue;

    // Flag to indicate our update line had at least one invalid update in it
    if (valid) valid = false;

    // Get index of the first prereq (and move the current page behind that)
    const prereqIndex = currUpdates.indexOf(firstPrereq);

    // Place current page after first found prereq
    currUpdates.splice(prereqIndex + 1, 0, currUpdates[j])
    // Remove current page
    currUpdates.splice(j, 1);
    // Decrement j to account for new item in current j position
    j--;
    // Add page back to our pendingUpdates set
    pendingUpdatesSet.add(page);
  }

  if (!valid) {
    const middlePage = parseInt(currUpdates[Math.floor(currUpdates.length / 2)]);
    sum += middlePage;
  }
}

console.log(`The solution is ${sum}`);
