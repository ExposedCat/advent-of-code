// @deno-types="npm:@types/pathfinding"
import PF from "pathfinding";
const input = await Deno.readTextFile("./src/2024/day20/input.txt");

// FIXME: Part 2

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

const grid = new PF.Grid(matrix);
const finder = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.Never,
});
const path = finder.findPath(startX, startY, endX, endY, grid);
const fair = path.length;

let total = 0;
for (let y = 0; y < matrix.length; ++y) {
  for (let x = 0; x < matrix[y].length; ++x) {
    if (matrix[y][x] === 1) {
      matrix[y][x] = 0;
      const grid = new PF.Grid(matrix);
      const path = finder.findPath(startX, startY, endX, endY, grid);
      const save = fair - path.length;
      if (save >= 100) {
        total += 1;
      }
      matrix[y][x] = 1;
    }
  }
}

console.log(total);
