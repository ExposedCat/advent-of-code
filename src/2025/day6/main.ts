import { range } from "../../utils/constructions.ts";
import { IS_PART_2 } from "../../utils/env.ts";
import { product, sum, sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day6/input.txt");

const rows = input.split("\n");

if (!IS_PART_2) {
	const expressions = rows.map(row => row.trim().split(/\s+/))
	const total = sum(range(expressions[0].length, (i) => {
		const func = expressions.at(-1)![i] === "+" ? sum : product;
		const items = range(expressions.length - 1, (j) => Number(expressions[j][i]))
		return func(items);
	}))
	console.log(total);
} else {
	const expressions: { list: number[], operator: string }[] = [];

	let expressionIndex = 0
	range(rows[0].length, i => {
		expressions[expressionIndex] ??= { list: [], operator: "" };
		if (rows.every(row => row[i] === " ")) {
			expressionIndex += 1;
			return;
		}
		let value = ''
		for (const row of rows) {
			if (row[i] === "+" || row[i] === "*") {
				expressions[expressionIndex].operator = row[i];
				break;
			}
			value += row[i].trim();
		}
		expressions[expressionIndex].list.push(Number(value));
	})

	const grandTotal = sumBy(
		expressions,
		expression => expression.operator === "+" ? sum(expression.list) : product(expression.list)
	)

	console.log(grandTotal)
}