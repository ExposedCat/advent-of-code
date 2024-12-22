import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day6/input.txt");

const GUARD = "^";
const WALL = "#";

type Cell = typeof GUARD | typeof WALL;

const grid = input.split("\n").slice(0, -1)
  .map((line) => line.split("") as Cell[]);

const guardY = grid.findIndex((line) => line.includes(GUARD));
const guardX = grid[guardY].indexOf(GUARD);
const guard = { x: guardX, y: guardY };

function isLooped(map: Cell[][]) {
  guard.x = guardX;
  guard.y = guardY;
  let direction = { x: 0, y: -1 };
  const cells = {
    [`${guard.y};${guard.x}`]: `${direction.y};${direction.x}`,
  };

  const move = () => {
    const tile = map[guard.y + direction.y]?.[guard.x + direction.x];
    if (!tile || tile === WALL) {
      return { end: !tile, rotate: true, loop: false };
    }
    guard.y += direction.y;
    guard.x += direction.x;
    if (cells[`${guard.y};${guard.x}`] !== `${direction.y};${direction.x}`) {
      cells[`${guard.y};${guard.x}`] = `${direction.y};${direction.x}`;
      return { end: false, rotate: false, loop: false };
    }
    return { end: true, rotate: false, loop: true };
  };

  const turn = () => {
    direction = {
      "0.-1": { x: 1, y: 0 },
      "1.0": { x: 0, y: 1 },
      "0.1": { x: -1, y: 0 },
      "-1.0": { x: 0, y: -1 },
    }[`${direction.x}.${direction.y}` as string] as typeof direction;
  };

  while (true) {
    const { end, rotate, loop } = move();
    rotate && turn();
    if (end) {
      return { cells, loop };
    }
  }
}

const { cells } = isLooped(grid);

if (IS_PART_2) {
  const total = Object.keys(cells).reduce((sum, cell) => {
    const [y, x] = cell.split(";").map(Number);
    if (guardX === x && guardY === y) {
      return sum;
    }
    const newGrid = [...grid.map((line) => [...line])];
    newGrid[y][x] = WALL;
    const { loop } = isLooped(newGrid);
    return sum + Number(loop);
  }, 0);
  console.log(total);
} else {
  console.log(Object.keys(cells).length);
}
