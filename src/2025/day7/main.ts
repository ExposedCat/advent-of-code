import { range } from "../../utils/constructions.ts";
import { sum } from "../../utils/math.ts";
import { makeGrid } from "../../utils/grid.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2025/day7/input.txt");

const grid = input.split("\n").map(line => line.split(''))

const counts = makeGrid(grid[0].length, grid.length, () => 0)

let splits = 0

const beam = (y: number, x: number) => {
	if (grid[y]?.[x] === '.') {
		grid[y][x] = '|'
		for (const dx of [-1, 0, 1]) {
			if (['|', 'S'].includes(grid[y - 1][x + dx]) && (dx === 0 || grid[y][x + dx] === '^')) {
				counts[y][x] += counts[y - 1][x + dx] || (grid[y - 1][x + dx] === 'S' ? 1 : 0)
			}
		}
	} else if (grid[y]?.[x] === '^') {
		splits += 1
		beam(y, x - 1)
		beam(y, x + 1)
	}
}

range(grid.length, (y) => {
	range(grid[y].length, (x) => {
		if (grid[y][x] === '|' || grid[y][x] === 'S') {
			beam(y + 1, x)
		}
	})
})

console.log(IS_PART_2 ? sum(counts.at(-1)!) : splits)