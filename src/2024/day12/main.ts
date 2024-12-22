import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day12/input.txt");

const grid = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split(""));

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

type Component = [number, number][];

const visited = new Set<string>();
const components: Component[] = [];

const getComponent = (
  y: number,
  x: number,
  item: string,
  _component?: Component,
): Component => {
  _component ??= [];
  if (visited.has(`${y}.${x}`) || !grid[y]?.[x] || grid[y]?.[x] !== item) {
    return _component;
  }

  visited.add(`${y}.${x}`);
  _component.push([y, x]);

  for (const [dy, dx] of DIRECTIONS) {
    getComponent(y + dy, x + dx, item, _component);
  }

  return _component;
};

for (let y = 0; y < grid.length; ++y) {
  for (let x = 0; x < grid[y].length; ++x) {
    if (!visited.has(`${y}.${x}`)) {
      components.push(getComponent(y, x, grid[y][x]));
    }
  }
}

const result = sumBy(
  components,
  (component) =>
    component.length * sumBy(component, ([y, x]) => {
      const cells = [false, false, false, false];

      const perimeter = DIRECTIONS.reduce(
        (total, [dy, dx], direction) => {
          cells[direction] = !grid[y + dy]?.[x + dx] || !grid[y]?.[x] ||
            grid[y + dy][x + dx] !== grid[y][x];
          return total + Number(cells[direction]);
        },
        0,
      );

      if (!IS_PART_2) {
        return perimeter;
      }

      const outer = Number(cells[0] && cells[2]) +
        Number(cells[0] && cells[3]) + Number(cells[1] && cells[2]) +
        Number(cells[1] && cells[3]);

      const inner =
        Number(!cells[0] && !cells[2] && grid[y][x] !== grid[y + 1][x + 1]) +
        Number(!cells[0] && !cells[3] && grid[y][x] !== grid[y + 1][x - 1]) +
        Number(!cells[1] && !cells[2] && grid[y][x] !== grid[y - 1][x + 1]) +
        Number(!cells[1] && !cells[3] && grid[y][x] !== grid[y - 1][x - 1]);

      return inner + outer;
    }),
);

console.log(result);
