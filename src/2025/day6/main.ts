import { IS_PART_2 } from "../../utils/env.ts";
import { product, sum, sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day6/input.txt");

const rows = input.split("\n");

const valueRows = rows.slice(0, -1);
const signsRow = rows.at(-1)!.split("");
const signs = rows.at(-1)!.split(/\s+/);

const expressions = signs.map((sign) => ({ list: [] as number[], operator: sign, width: 1 }));

let index = -1;
for (const char of signsRow) {
	if (char !== " ") {
		index += 1;
		if (index > 0) {
			expressions[index - 1].width -= 1;
		}
	} else {
		expressions[index].width += 1;
	}
}

expressions.splice(expressions.length - 1, 1);

let lastIndex = 0;
for (const expression of expressions) {
	if (IS_PART_2) {
		for (let i = 0; i < expression.width; ++i) {
			let value = ''
			for (const row of valueRows) {
				const item = row.slice(lastIndex, lastIndex + expression.width);
				value += item[i];
			}
			expression.list.push(Number(value));
		}
	} else {
		for (const row of valueRows) {
			const item = row.slice(lastIndex, lastIndex + expression.width);
			expression.list.push(Number(item));
		}
	}
	lastIndex += expression.width + 1;
}
const grandTotal = sumBy(
	expressions,
	expression => expression.operator === "+" ? sum(expression.list) : product(expression.list)
)

console.log(grandTotal)