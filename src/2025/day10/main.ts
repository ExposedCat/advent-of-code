import { unorderedCombinations } from "../../utils/combinations.ts";
import { BREAK, range } from "../../utils/constructions.ts";
import { IS_PART_2 } from "../../utils/env.ts";
import { sum, sumBy } from "../../utils/math.ts";
import { load, add, mul, Variable, Expression } from "@knorpelsenf/knorpelsolve";

const input = await Deno.readTextFile("./src/2025/day10/input.txt");

const list = input.trim().split("\n").map(line => {
	const target = line.split("[")[1].split("]")[0].split("").map(state => state === "#");
	const buttons = line.split("]")[1].split(" ").slice(1, -1).map(button =>
		button.slice(1, -1).split(",").map(Number)
	);
	const joltage = line.split("{")[1].split("}")[0].split(",").map(Number);
	return { target, buttons, joltage };
});

if (!IS_PART_2) {
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
	console.log(total);
} else {
	using lib = await load();

	const total = sumBy(list, ({ buttons, joltage }, machine) => {
		const counterCount = Math.max(buttons[0]?.length ?? 0, joltage.length);
		const variableNames = buttons.map((_, i) => `${machine}_${i}`);

		const problem = lib.problem();
		const variables = buttons.map((_, i) =>
			problem.variable(variableNames[i], { min: 0, integer: true })
		);

		range(counterCount, counter => {
			const needed = joltage[counter] ?? 0;

			let expression: Variable | Expression | null = null;

			range(buttons.length, (buttonIndex) => {
				const coefficient = buttons[buttonIndex].filter(c => c === counter).length;
				if (!coefficient) return 0;

				const term = coefficient === 1
					? variables[buttonIndex]
					: mul(coefficient, variables[buttonIndex]);

				expression = expression === null ? term : add(expression, term);
				return 0;
			});

			problem.constraint(expression ?? 0, "==", needed);
			return 0;
		});

		const objective = variables.reduce(
			(acc, variable) => acc === 0 ? variable : add(acc, variable),
			0 as Variable | Expression | number
		);

		const solution = problem.minimize(objective as Variable | Expression);
		return sum(variableNames.map((name) => solution.values.get(name) ?? 0));
	});

	console.log(total);
}