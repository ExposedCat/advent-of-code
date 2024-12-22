import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day15/input.txt");

// Fuck! I lost first part code due to [fixed] bug in Zed
if (!IS_PART_2) {
  console.log("I lost first part code due to [fixed] bug in Zed");
  Deno.exit(1);
}

const extendedInput = input
  .replaceAll("#", "##")
  .replaceAll("O", "[]")
  .replaceAll(".", "..")
  .replaceAll("@", "@.");

const [_grid, _movements] = extendedInput.split("\n\n");
let grid = _grid.split("\n").map((line) => line.split(""));
const movements = _movements.replaceAll("\n", "").split("");

const directions: Record<string, [number, number]> = {
  "<": [0, -1],
  ">": [0, 1],
  "^": [-1, 0],
  "v": [1, 0],
};

const robot = {
  x: 0,
  y: grid.findIndex((line) => line.includes("@")),
};
robot.x = grid[robot.y].indexOf("@");

const shift = (y: number, x: number, dy: number, grid: string[][]): boolean => {
  const self = grid[y][x];
  const secondSelf = self === "[" ? "]" : "[";
  const secondX = self === "[" ? x + 1 : x - 1;
  if (grid[y + dy][x] === "#" || grid[y + dy][secondX] === "#") {
    return false;
  }
  if (grid[y + dy][x] === "[" || grid[y + dy][x] === "]") {
    const result = shift(y + dy, x, dy, grid);
    if (!result) {
      return false;
    }
  }
  if (grid[y + dy][secondX] === "[" || grid[y + dy][secondX] === "]") {
    const result = shift(y + dy, secondX, dy, grid);
    if (!result) {
      return false;
    }
  }
  grid[y + dy][x] = self;
  grid[y + dy][secondX] = secondSelf;
  grid[y][x] = grid[y][secondX] = ".";
  return true;
};

const move = (direction: string) => {
  const [dy, dx] = directions[direction];
  const [targetY, targetX] = [robot.y + dy, robot.x + dx];
  const target = grid[targetY][targetX];
  switch (target) {
    case ".": {
      grid[robot.y][robot.x] = ".";
      grid[targetY][targetX] = "@";
      robot.x = targetX;
      robot.y = targetY;
      return;
    }
    case "[":
    case "]": {
      const isLeft = direction === "<";
      if (dy === 0) {
        const freeSpace = grid[robot.y][isLeft ? "lastIndexOf" : "indexOf"](
          ".",
          robot.x,
        );
        const wall = grid[robot.y][isLeft ? "lastIndexOf" : "indexOf"](
          "#",
          robot.x,
        );
        if (wall !== -1 && freeSpace !== -1) {
          if (isLeft ? freeSpace < wall : freeSpace > wall) {
            return;
          }
        }
        const leftItem = isLeft ? freeSpace : robot.x;
        const rightItem = isLeft ? robot.x : freeSpace;
        if (freeSpace !== -1 && (!isLeft || freeSpace < robot.x)) {
          const newRow = [...grid[robot.y].slice(0, leftItem)];
          if (!isLeft) {
            newRow.push(".", "@");
          }
          newRow.push(...grid[robot.y].slice(leftItem + 1, rightItem));
          if (isLeft) {
            newRow.push("@", ".");
          }
          newRow.push(...grid[robot.y].slice(rightItem + 1));
          grid[robot.y] = newRow;
          robot.x += dx;
        }
      } else {
        const newGrid = grid.map((line) => [...line]);
        const result = shift(robot.y + dy, robot.x, dy, newGrid);
        if (result) {
          grid = newGrid;
          move(direction);
        }
      }
    }
  }
};

for (const movement of movements) {
  move(movement);
}

const result = sumBy(
  grid,
  (line, y) => sumBy(line, (item, x) => item === "[" ? 100 * y + x : 0),
);

console.log(result);
