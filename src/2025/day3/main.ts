import { IS_PART_2 } from "../../utils/env.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day3/input.txt");

const banks = input.trim().split("\n").map(bank => bank.split("").map(Number));

function getBankJoltage(bank: number[], amount: number): number {
	let lastIndex = 0
	let result = 0
	for (let i = 0; i < amount; ++i) {
		const piece = bank.slice(lastIndex, bank.length - amount + 1 + i)
		const index = piece.indexOf(Math.max(...piece))
		lastIndex += index + 1
		result += piece[index] * 10 ** (amount - i - 1)
	}
	return result
}

console.log(sumBy(banks, bank => getBankJoltage(bank, IS_PART_2 ? 12 : 2)))