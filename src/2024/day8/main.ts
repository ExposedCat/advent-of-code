import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day8/input.txt");

const NONE = ".";

const grid = input.split("\n").slice(0, -1).map(
  (line) => line.split(""),
);

const locations = new Set<string>();

for (let y = 0; y < grid.length; ++y) {
  for (let x = 0; x < grid[y].length; ++x) {
    const cell = grid[y][x];
    if (cell !== NONE) {
      for (let endY = y; endY < grid.length; ++endY) {
        for (
          let endX = endY === y ? x + 1 : 0;
          endX < grid[endY].length;
          ++endX
        ) {
          if (cell === grid[endY][endX]) {
            if (IS_PART_2) {
              locations.add(`${y};${x}`);
              locations.add(`${endY};${endX}`);
            }
            const distX = endX - x;
            const distY = endY - y;
            let firstMatch: boolean;
            let lastMatch: boolean;
            let diffX = 0;
            let diffY = 0;
            do {
              diffX += distX;
              diffY += distY;
              const firstY = y - diffY;
              const firstX = x - diffX;
              const lastY = endY + diffY;
              const lastX = endX + diffX;
              firstMatch = !!grid[firstY]?.[firstX];
              if (firstMatch) {
                locations.add(`${firstY};${firstX}`);
              }

              lastMatch = !!grid[lastY]?.[lastX];
              if (lastMatch) {
                locations.add(`${lastY};${lastX}`);
              }
              if (!IS_PART_2) {
                break;
              }
            } while ((firstMatch || lastMatch));
          }
        }
      }
    }
  }
}

console.log(locations.size);
