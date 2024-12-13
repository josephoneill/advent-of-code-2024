import * as fs from 'fs';
import path from 'path';

const rawInput = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const inputArray: string[] = rawInput.split(/[\r\n]+/);
let sum = 0;

class BlockNode {
  next: BlockNode | null;
  prev: BlockNode | null;
  value: Block;

  constructor(value: Block, next = null) {
    this.value = value;
    this.next = next;
    this.prev = null;
  }
}

class Block {
  id: number;
  size: number;
  free: boolean;

  constructor(id: number, size: number, free: boolean) {
    this.id = id;
    this.size = size;
    this.free = free;
  }
}

const dummy = new BlockNode(new Block(-1, 0, true));
let node = dummy;

for (let i = 0; i < inputArray.length; i++) {
  for (let j = 0; j < inputArray[i].length; j += 2) {
    const chunk: number[] = inputArray[i].slice(j, j + 2).split('').map(x => parseInt(x, 10));
    const id = j / 2;
    
    const block = new Block(id, chunk[0], false);
    node.next = new BlockNode(block);
    node.next.prev = node;
    node = node.next;

    if (chunk[1]) {
      const freeBlock = new Block(-1, chunk[1], true);
      node.next = new BlockNode(freeBlock);
      node.next.prev = node;
      node = node.next;
    }
  }
}

function findAvailableFreeNode(start: BlockNode | null, size: number, maxNode: BlockNode): BlockNode | null {
  let node: BlockNode | null = start;
  while (node && node !== maxNode) {
    if (node.value.free && node.value.size >= size) {
      return node;
    }

    node = node.next;
  }

  return null;
}

function insertBefore(nextNode: BlockNode, newNode: BlockNode) {
  newNode.prev = nextNode.prev;
  newNode.next = nextNode;

  if (nextNode.prev) {
    nextNode.prev.next = newNode;
  }

  nextNode.prev = newNode;
}

let reverseNode: BlockNode | null = node;
let sizeThreshold = Number.MAX_SAFE_INTEGER;

while (reverseNode !== null && reverseNode !== dummy.next) {
  while (reverseNode && (reverseNode.value.free || reverseNode.value.size >= sizeThreshold)) {
    reverseNode = reverseNode.prev;
  }

  // We've hit the end of the list, break
  if (!reverseNode || reverseNode === dummy.next) break;

  const prev: BlockNode | null = reverseNode.prev;

  // Move this node to the first available slot
  const targetNode = findAvailableFreeNode(dummy.next, reverseNode.value.size, reverseNode);
  // No free space, adjust threshold
  if (!targetNode) {
    sizeThreshold = reverseNode.value.size;
    continue;
  } else {
    // Found the available slot, add our block
    const remainingSize = targetNode.value.size - reverseNode.value.size;

    targetNode.value.size = remainingSize;

    // Remove reverseNode from current position
    const copy = new BlockNode(new Block(-1, reverseNode.value.size, true));
    copy.next = reverseNode.next;
    copy.prev = reverseNode.prev;
  
    if (reverseNode.prev) reverseNode.prev.next = copy;
    if (reverseNode.next) reverseNode.next.prev = copy;

    insertBefore(targetNode, reverseNode);

    // If remaining size is 0, just delete the free block
    if (remainingSize === 0 && targetNode.prev) {
      reverseNode.next = targetNode.next;
      if (targetNode.next) targetNode.next.prev = reverseNode;
    }
  }

  reverseNode = prev;
}

function printLinkedList() {
  let listStr = '';
  let node: BlockNode | null = dummy;
  while (node) {
    if (node.value?.id === -1) {
      listStr += Array(node.value.size).fill('.').join('');
    } else {
      listStr += Array(node.value?.size).fill(node.value?.id).join('');
    }
    node = node.next;
  }

  console.log(listStr);
}

let i = 0;
let n = dummy.next;
while (n) {
  if (n.value.id !== -1) {
    for (let j = 0; j < n.value.size; j++, i++) {
      sum += (i * n.value.id);
    } 
  } else {
    i += n.value.size;
  }

  n = n.next;
}

console.log(`The solution is ${sum}`);