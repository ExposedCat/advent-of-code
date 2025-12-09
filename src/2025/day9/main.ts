import { range } from "../../utils/constructions.ts";
import { isInPolygon } from "../../utils/grid.ts";

const input = await Deno.readTextFile("./src/2025/day9/input.txt");

const list = input.trim().split("\n").map(line => line.split(',').map(Number))

// History note: this task took me entire day instead of a few hours
// 
// because instead of
// (|x1 - x2| + 1) * (|y1 - y2| + 1)
// I was doing
// (|x1 - x2 + 1|) * (|y1 - y2 + 1|)
//
// FUCK ME I HATED THIS ONE

const pairs: [number[], number[], number][] = []
range(list.length, (i) => {
  range(list.length - i - 1, (j) => {
    const corner1 = list[i]
    const corner2 = list[i + j + 1]
		pairs.push([corner1, corner2, (Math.abs(corner1[0] - corner2[0]) + 1) * (Math.abs(corner1[1] - corner2[1]) + 1)])
  })
})
pairs.sort((a, b) => b[2] - a[2])

console.log('You might want to go do something because this will take a while...')

let checked = 0
pairLoop: for (const [corner1, corner2, area] of pairs.slice(0)) {
	checked += 1
	console.log(checked)

	const minX = Math.min(corner1[0], corner2[0])
	const minY = Math.min(corner1[1], corner2[1])
	const maxX = Math.max(corner1[0], corner2[0])
	const maxY = Math.max(corner1[1], corner2[1])

	if ([[minX, minY], [maxX, minY], [minX, maxY], [maxX, maxY]].some(corner => !isInPolygon(corner, list))) {
		continue
	}

	for (let x = minX + 1; x <= maxX - 1; x++) {
		if (!isInPolygon([x, minY], list) || !isInPolygon([x, maxY], list)) {
			continue pairLoop
		}
	}
	for (let y = minY + 1; y <= maxY - 1; y++) {
		if (!isInPolygon([minX, y], list) || !isInPolygon([maxX, y], list)) {
			continue pairLoop
		}
	}

	console.log('MAX',area, corner1, corner2)
	break
}
