import { unorderedCombinations } from "../../utils/combinations.ts";
import { BREAK, range } from "../../utils/constructions.ts";
import { sum, sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day10/input.txt");

const list = input.trim().split("\n").map(line => {
	const target = line.split('[')[1].split(']')[0].split('').map(state => state === '#')
	const buttons = line.split(']')[1].split(' ').slice(1,-1).map(button => button.slice(1,-1).split(',').map(Number))
	const joltage = line.split('{')[1].split('}')[0].split(',').map(Number)
	return { target, buttons, joltage }
})

const total = sumBy(list, ({ target, buttons }) => sum(range(buttons.length - 1, (k) => {
	const combos = unorderedCombinations(buttons, k + 1)
	for (const combo of combos) {
		const result = Array.from({ length: target.length }, () => false)
		for (const button of combo) {
			for (const position of button) {
				result[position] = !result[position]
			}
		}
		if (result.every((state, i) => state === target[i])) {
			return [combo.length, BREAK]
		}
	}
	return 0
})))

console.log(total)