import { Graph, alg as graphAlg } from 'graphlib';

import { range } from "../../utils/constructions.ts";
import { sum } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day7/input.txt");

const grid = input.split("\n").map(line => line.split(''))

const graph = new Graph({ directed: true });

let splits = 0

const beam = (y: number, x: number) => {
	if (!grid[y]?.[x]) {
		return;
	}
	if (grid[y][x] === '.') {
		grid[y][x] = '|'
		graph.setNode(`${y},${x}`)
		for (const dx of [-1, 0, 1]) {
			if (grid[y - 1][x + dx] === '|' && (dx === 0 || grid[y][x + dx] === '^')) {
				graph.setEdge(`${y - 1},${x + dx}`, `${y},${x}`)
			}
		}
	} else if (grid[y][x] === '^') {
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

const sorted = graphAlg.topsort(graph)
const beams: Record<string, number> = {}

for (const point of sorted) {
	const next = graph.successors(point) ?? []
	for (const particle of next) {
		beams[particle] ??= 0
		beams[particle] += beams[point] ?? 1
	}
}

const total = sum(range(grid[0].length, (x) => beams[`${grid.length - 1},${x}`] ?? 0))
console.log(total)