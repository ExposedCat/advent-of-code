import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day14/input.txt");

const WIDTH = 101;
const HEIGHT = 103;

const CX = Math.floor(WIDTH / 2);
const CY = Math.floor(HEIGHT / 2);

function after(seconds: number) {
  const robots = input.split("\n").slice(0, -1).map((line) => {
    const p = line.split("=")[1];
    const v = line.split("=")[2];
    return {
      x: parseInt(p),
      y: parseInt(p.split(",")[1]),
      vX: parseInt(v),
      vY: parseInt(v.split(",")[1]),
    };
  });
  const map = new Array(HEIGHT).fill(0).map(() => new Array(WIDTH).fill("_"));
  const result = {
    lt: 0,
    lb: 0,
    rt: 0,
    rb: 0,
  };
  for (const robot of robots) {
    robot.x += robot.vX * seconds;
    robot.x %= WIDTH;
    while (robot.x < 0) {
      robot.x += WIDTH;
    }
    robot.y += robot.vY * seconds;
    robot.y %= HEIGHT;
    while (robot.y < 0) {
      robot.y += HEIGHT;
    }
    map[robot.y][robot.x] = "X";
    if (robot.x === CX || robot.y === CY) {
      continue;
    }
    const horizontal = robot.x < CX ? "l" : "r";
    const vertical = robot.y < CY ? "t" : "b";
    result[`${horizontal}${vertical}`] += 1;
  }

  // console.log(map.map((row) => row.join("")).join("\n"));
  // console.log();
  return { result, map };
}

function isTree(grid: string[][]) {
  return grid.some((line) => line.join("").includes("XXXXXXXXXXX"));
}

if (IS_PART_2) {
  let i = 0;
  let map;
  do {
    const result = after(i);
    map = result.map;
    i += 1;
  } while (!isTree(map));

  console.log(i - 1);
} else {
  const { result } = after(100);
  console.log(result.lt * result.lb * result.rt * result.rb);
}
