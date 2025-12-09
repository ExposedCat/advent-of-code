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

// Might want to switch to some ready-made library for this
export function isInPolygon(
	[x, y]: number[],
  corners: number[][]
): boolean {
  const n = corners.length;
  if (n < 3) return false;

  let inside = false;

  // j = previous vertex index
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = corners[i][0];
    const yi = corners[i][1];
    const xj = corners[j][0];
    const yj = corners[j][1];

    // --- 1) Fast boundary check for horizontal edges (your (3,5) case) ---
    if (yi === yj && y === yi) {
      // if x lies between xi and xj (inclusive), it's on the edge
      if (
        (x >= (xi < xj ? xi : xj)) &&
        (x <= (xi > xj ? xi : xj))
      ) {
        return true;
      }
      // horizontal edge doesn't affect crossings; continue
      continue;
    }

    // --- 2) Even–odd rule (pnpoly style) ---
    // Check if edge (xj,yj)-(xi,yi) crosses the horizontal ray to +∞ from (x,y)
    const yiAbove = yi > y;
    const yjAbove = yj > y;

    if (yiAbove !== yjAbove) {
      // Compute x-coordinate of intersection of the edge with the horizontal line at y
      const intersectX =
        ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      // boundary on non-horizontal edges (rare but basically free)
      if (intersectX === x) {
        return true;
      }

      if (intersectX > x) {
        inside = !inside;
      }
    }
  }

  return inside;
}