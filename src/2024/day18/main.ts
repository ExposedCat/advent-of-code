//@deno-types=npm:@types/pathfinding
import PF from "pathfinding";
import { makeGrid } from "../../utils/grid.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day18/input.txt");

const coordinates = input.split("\n").slice(0, -1).map((item) =>
  item.split(",")
);

const SIZE = 71;
const CROP = 1024;

const finder = new PF.DijkstraFinder({
  diagonalMovement: PF.DiagonalMovement.Never,
});

function tryPath(
  coords: string[][],
  wallX: number | null,
  wallY: number | null,
) {
  const matrix = makeGrid(SIZE, SIZE);

  for (const [x, y] of coords) {
    matrix[Number(y)][Number(x)] = 1;
  }

  if (wallX !== null && wallY !== null) {
    matrix[wallY][wallX] = 1;
  }

  const grid = new PF.Grid(matrix);
  return finder.findPath(0, 0, SIZE - 1, SIZE - 1, grid);
}

const correct = tryPath(coordinates.slice(0, CROP), null, null);
console.log(`Correct: ${correct.length - 1}`);

if (IS_PART_2) {
  for (let i = CROP + 1; i < coordinates.length; ++i) {
    const [x, y] = coordinates[i];
    const tried = tryPath(coordinates.slice(0, i), Number(x), Number(y));
    if (tried.length === 0) {
      console.log(`${x},${y}`);
      break;
    }
  }
}
