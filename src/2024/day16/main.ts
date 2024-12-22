// FIXME: Part 1 - Removed custom heuristic A*
// FIXME: Part 2

const input = await Deno.readTextFile("./src/2024/day16/input.txt");

const START = 3;
const STOP = 4;

const matrix = input.split("\n").slice(0, -1).map((line) =>
  line.split("").map((item) =>
    item === "#" ? 1 : item === "S" ? START : item === "E" ? STOP : 0
  )
);
const startY = matrix.findIndex((line) => line.includes(START));
const startX = matrix[startY].indexOf(START);

const endY = matrix.findIndex((line) => line.includes(STOP));
const endX = matrix[endY].indexOf(STOP);

matrix[startY][startX] = 0;
matrix[endY][endX] = 0;

// ...
