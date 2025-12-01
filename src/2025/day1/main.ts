import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2025/day1/input.txt");

const result = input.split("\n");

const START = 50
const MAX = 99+1

const [_, amount] = result.reduce(([value, zeroes], rotation) => {
	const clicks = Number(rotation.slice(1))
	let wasZero = value === 0
	value += (rotation.startsWith("L") ? -clicks : clicks)
	while (value < 0 || value >= MAX) {
		if (IS_PART_2) {
			zeroes += Number(!(wasZero && value < 0) && value !== MAX)
		}
		value += value < 0 ? MAX : -MAX
		wasZero = false
	} 
	value %= MAX
	zeroes += Number(value === 0)
	return [value, zeroes];
},[START,0]);

console.log(amount);