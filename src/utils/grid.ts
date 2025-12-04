export const printGrid = <T extends string | number>(
  grid: T[][],
  mapping: Partial<Record<T, string>> = {} as Record<T, string>,
) =>
  console.log(
    grid.map((line) => line.map((item) => mapping[item] ?? item).join(""))
      .join("\n"),
    "\n",
  );

export const cloneGrid = <T = number>(grid: T[][]) =>
  grid.map((line) => [...line]);

export const makeGrid = <T = number>(
  width: number,
  height: number,
  fill?: (y: number, x: number) => T,
) =>
  Array.from({ length: height }).map((_, y) =>
    Array.from({ length: width }).map((__, x) => fill ? fill(y, x) : 0)
  );

export const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export const EIGHT_DIRECTIONS = [...DIRECTIONS, [1, 1], [-1, 1], [1, -1], [-1, -1]];
