import { range } from "../../utils/constructions.ts";
import { lpSolve } from "../../utils/lp.ts";
import { sum } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day10/input.txt");

const list = input.trim().split("\n").map(line => {
	const target = line.split("[")[1].split("]")[0].split("").map(state => state === "#");
	const buttons = line.split("]")[1].split(" ").slice(1, -1).map(button =>
		button.slice(1, -1).split(",").map(Number)
	);
	const joltage = line.split("{")[1].split("}")[0].split(",").map(Number);
	return { target, buttons, joltage };
});

const totals: number[] = [];

for (let machine = 0; machine < list.length; machine++) {
	const { buttons, joltage, target } = list[machine];

	const counterCount = Math.max(target.length, joltage.length);
	const variableNames = buttons.map((_, i) => `${machine}_${i}`);

	const constraints = Object.fromEntries(
		range<[string, { min: number; max: number }]>(counterCount, (counterIdx) => {
			const needed = joltage[counterIdx] ?? 0;
			return [`counter_${counterIdx}`, { min: needed, max: needed }];
		}),
	);

	const variables = Object.fromEntries(
		buttons.map((button, idx) => {
			const entries = button.reduce<Record<string, number>>((entryAcc, counter) => {
				const key = `counter_${counter}`;
				entryAcc[key] = (entryAcc[key] ?? 0) + 1;
				return entryAcc;
			}, { total: 1 });
			return [variableNames[idx], entries];
		}),
	);

	const { result } = lpSolve({
		optimize: "total",
		opType: "min",
		constraints,
		variables,
		ints: Object.fromEntries(variableNames.map((name) => [name, 1])),
	});

	totals.push(result);
}

console.log(sum(totals));