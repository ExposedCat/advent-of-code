import { range } from "../../utils/constructions.ts";
import { IS_PART_2 } from "../../utils/env.ts";
import { product } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day8/input.txt");

const coordinates = input.trim().split("\n").map(line => line.split(',').map(Number))

const distances: Array<[string, string, number]> = []

const distance = ([x1,y1,z1]: number[], [x2,y2,z2]: number[]) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)
}

range(coordinates.length, (i) => {
  range(coordinates.length - i - 1, (j) => {
		const source = coordinates[i]
		const target = coordinates[i + j + 1]
    distances.push([source.join(','), target.join(','), distance(source, target)])
  })
})

distances.sort((a, b) => a[2] - b[2])

const circuits: Set<string>[] = []

for (const distance of distances.slice(0, IS_PART_2 ? undefined : 1000)) {
	const [source, target] = distance
	const circuit = circuits.find(circuit => circuit.has(source) || circuit.has(target))
	if (circuit) {
		circuit.add(source)
		circuit.add(target)
	} else {
		circuits.push(new Set([source, target]))
	}
	merge: for (let i = 0; i < circuits.length; i++) {
		for (let j = 0; j < i; j++) {
			if (i === j) continue
			if ([...circuits[i]].some(box => circuits[j].has(box))) {
				for (const box of circuits[j]) {
					circuits[i].add(box)
				}
				circuits.splice(j, 1)
				break merge
			}
		}
	}
	if (IS_PART_2 && circuits[0].size === coordinates.length) {
		const [sourceX] = source.split(',')
		const [targetX] = target.split(',')
		console.log(Number(sourceX) * Number(targetX))
		break
	}
}

if (!IS_PART_2) {
	const sizes = circuits.map(circuit => circuit.size)
	const largest = range(3, () => {
		const largest = Math.max(...sizes)
		sizes.splice(sizes.indexOf(largest), 1)
		return largest
	})
	console.log(product(largest))
}