import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day10/input.txt");

const grid = input.split("\n").slice(0, -1).map((line) =>
  line.split("").map(Number)
);

const getNext = (y: number, x: number) =>
  [[1, 0], [-1, 0], [0, 1], [0, -1]].reduce((list, [dy, dx]) => {
    (grid[y + dy]?.[x + dx] === grid[y][x] + 1) && list.push([y + dy, x + dx]);
    return list;
  }, [] as [number, number][]);

const getTrailScore = (
  y: number,
  x: number,
  _targets: Set<string> = new Set(),
): number =>
  getNext(y, x).reduce(
    (total, [nextY, nextX]) => {
      if (grid[y][x] === 8) {
        const target = `${nextY};${nextX}`;
        if (!IS_PART_2 && _targets.has(target)) {
          return total;
        }
        _targets.add(target);
        return total + Number(grid[nextY][nextX] === 9);
      } else {
        return total + getTrailScore(nextY, nextX, _targets);
      }
    },
    0,
  );

const total = grid.flatMap((row, y) =>
  row.map((cell, x) => (cell === 0 ? getTrailScore(y, x) : 0))
).reduce((total, score) => total + score, 0);

console.log(total);
