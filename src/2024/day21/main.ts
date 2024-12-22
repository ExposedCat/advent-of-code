import { range } from "../../utils/constructions.ts";
import { sumBy } from "../../utils/math.ts";
const input = await Deno.readTextFile("./src/2024/day21/input.txt");

// FIXME: Part 2

type Point = [number, number];
type Path = Point[];

function findBestPaths(grid: number[][], start: Point, end: Point): Path[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances = new Map<string, number>();
  const paths = new Map<string, Path[]>();
  const queue: { pos: Point; dist: number; path: Path }[] = [
    { pos: start, dist: 0, path: [start] },
  ];
  let shortestToEnd = Infinity;

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const { pos: [x, y], dist, path } = queue.shift()!;
    const key = `${x},${y}`;

    if (dist > shortestToEnd) break;

    const knownDist = distances.get(key);
    if (knownDist !== undefined && dist > knownDist) continue;

    if (knownDist === undefined || dist === knownDist) {
      distances.set(key, dist);
      const currentPaths = paths.get(key) || [];
      currentPaths.push(path);
      paths.set(key, currentPaths);

      if (x === end[0] && y === end[1]) {
        shortestToEnd = dist;
        continue;
      }

      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX < 0 || newX >= rows ||
          newY < 0 || newY >= cols ||
          grid[newX][newY] === 1
        ) continue;

        queue.push({
          pos: [newX, newY],
          dist: dist + 1,
          path: [...path, [newX, newY]],
        });
      }
    }
  }

  return paths.get(`${end[0]},${end[1]}`) || [];
}

function convertPathToDirections(
  path: Point[],
  segmentLengths: number[],
): string[] {
  const directions: string[] = [];
  let pointCount = 0;
  let sum = 0;

  range(path.length - 1, (i) => {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];

    if (x2 < x1) directions.push("^");
    else if (x2 > x1) directions.push("v");
    else if (y2 < y1) directions.push("<");
    else if (y2 > y1) directions.push(">");

    pointCount++;
    sum = 0;
    for (const length of segmentLengths) {
      sum += length;
      if (pointCount === sum) {
        directions.push("A");
      }
    }
  });

  return directions;
}

const pathCache = new Map<string, string[][]>();
function findAllPossiblePaths(
  grid: number[][],
  positions: Point[],
): string[][] {
  const key = JSON.stringify([grid, positions]);
  if (pathCache.has(key)) {
    return pathCache.get(key)!;
  }
  if (positions.length < 2) return [];

  const allPaths: string[][] = [];
  const pathSegments: Point[][][] = [];
  const segmentLengths: number[] = [];

  for (let i = 0; i < positions.length - 1; i++) {
    if (
      positions[i][0] === positions[i + 1][0] &&
      positions[i][1] === positions[i + 1][1]
    ) {
      pathSegments.push([[]]);
      segmentLengths.push(0);
    } else {
      const paths = (grid === numericGrid ? numericPaths : directionalPaths)[
        `${positions[i][0]},${positions[i][1]}`
      ][`${positions[i + 1][0]},${positions[i + 1][1]}`];
      if (paths.length === 0) return [];
      pathSegments.push(paths);
      segmentLengths.push(paths[0].length - 1);
    }
  }

  function buildPaths(currentPath: Point[], segmentIndex: number) {
    if (segmentIndex === pathSegments.length) {
      allPaths.push(convertPathToDirections(currentPath, segmentLengths));
      return;
    }

    for (const segment of pathSegments[segmentIndex]) {
      const newPath = [
        ...currentPath,
        ...segment.slice(currentPath.length ? 1 : 0),
      ];
      buildPaths(newPath, segmentIndex + 1);
    }
  }

  buildPaths([], 0);
  pathCache.set(key, allPaths);
  return allPaths;
}

const codes = input.split("\n").slice(0, -1).map((code) => ({
  keys: code.split(""),
  value: parseInt(code),
}));

type Code = (typeof codes)[number];

const numericGrid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [1, 0, 0],
];

const numericMapping: Record<string, [number, number]> = {
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "0": [3, 1],
  "A": [3, 2],
};

const directionalGrid = [
  [1, 0, 0],
  [0, 0, 0],
];

const directionalMapping: Record<string, [number, number]> = {
  "^": [0, 1],
  "A": [0, 2],
  "<": [1, 0],
  "v": [1, 1],
  ">": [1, 2],
};
function typeCode(code: Code, iterations: number) {
  const positions = code.keys.map((key) => numericMapping[key]);
  positions.unshift(numericMapping["A"]);
  let directions = findAllPossiblePaths(numericGrid, positions);

  const seen = new Map<string, number>(); // state -> iteration
  let i = 0;

  while (i < iterations) {
    const minLength = Math.min(...[
      ...new Set(directions.map((d) => d.length)),
    ]);
    directions = directions.filter((d) => d.length === minLength);
    const state = JSON.stringify(directions.sort());

    if (seen.has(state)) {
      const cycleStart = seen.get(state)!;
      const cycleLength = i - cycleStart;
      const remainingIterations = (iterations - i) % cycleLength;

      // Fast forward to end
      for (let j = 0; j < remainingIterations; j++) {
        directions = directions.flatMap((direction) =>
          findAllPossiblePaths(
            directionalGrid,
            [
              directionalMapping["A"],
              ...direction.map((key) => directionalMapping[key]),
            ],
          )
        );
        const minLen = Math.min(...[
          ...new Set(directions.map((d) => d.length)),
        ]);
        directions = directions.filter((d) => d.length === minLen);
      }
      break;
    }

    seen.set(state, i);
    directions = directions.flatMap((direction) =>
      findAllPossiblePaths(
        directionalGrid,
        [
          directionalMapping["A"],
          ...direction.map((key) => directionalMapping[key]),
        ],
      )
    );
    i++;
  }

  return code.value *
    Math.min(...[...new Set(directions.map((d) => d.length))]);
}

type GridPaths = Record<string, Record<string, Path[]>>;

function generateAllPaths(grid: number[][]): GridPaths {
  const paths: GridPaths = {};

  for (let x1 = 0; x1 < grid.length; x1++) {
    for (let y1 = 0; y1 < grid[0].length; y1++) {
      const fromKey = `${x1},${y1}`;
      paths[fromKey] = {};

      for (let x2 = 0; x2 < grid.length; x2++) {
        for (let y2 = 0; y2 < grid[0].length; y2++) {
          const toKey = `${x2},${y2}`;
          paths[fromKey][toKey] = findBestPaths(grid, [x1, y1], [x2, y2]);
        }
      }
    }
  }

  return paths;
}

const numericPaths = generateAllPaths(numericGrid);
const directionalPaths = generateAllPaths(directionalGrid);

console.log(sumBy(codes, (code) => typeCode(code, 2)));
// typeCode(codes[0]);
