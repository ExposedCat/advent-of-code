import { range } from "../../utils/constructions.ts";
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

const circuits: string[][] = []

for (const distance of distances.slice(0, 1000)) {
	const [source, target] = distance
	const circuit = circuits.find(circuit => circuit.includes(source) || circuit.includes(target))
	if (circuit) {
		circuit.push(source)
		circuit.push(target)
	} else {
		circuits.push([source, target])
	}
}

let mergedCircuits: string[][] = []
do {
	const newMerged = circuits.reduce((acc, circuit) => {
		const merged = acc.find(merged => merged.some(box => circuit.includes(box)))
		if (merged) {
			merged.push(...circuit)
		} else {
			acc.push(circuit)
		}
		return acc
	}, [] as string[][])
	if (newMerged.length !== mergedCircuits.length) {
		mergedCircuits = newMerged
	} else {
		break
	}
} while (true)

const sizes = mergedCircuits.map(circuit => new Set(circuit).size)
const largest = range(3, () => {
	const largest = Math.max(...sizes)
	sizes.splice(sizes.indexOf(largest), 1)
	return largest
})
console.log(product(largest))