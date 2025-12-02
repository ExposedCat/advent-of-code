import { IS_PART_2 } from "../../utils/env.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day2/input.txt");

const ids = input
	.split("\n")
	.flatMap(
		line => line
			.split(",")
			.map(item => item.split("-").map(Number))
	);

const result = sumBy(ids, ([start, end]) => {
	let total = 0;
	for (let id = start; id <= end; id++) {
		const idString = id.toString();
		if (IS_PART_2) {
			if (idString.length < 2) {
				continue;
			}
			for (let i = 0; i < idString.length / 2; i++) {
				if (idString.replaceAll(idString.slice(0, i + 1), "") === '') {
					total += id;
					break
				}
			}
		} else {
			const length = id.toString().length;
			if (length % 2 !== 0) {
				continue;
			}
			const left = Math.floor(id / 10 ** (length / 2));
			const right = id % 10 ** (length / 2);
			if (left === right) {
				total += id;
			}
		}
	}
	return total;
});

console.log(result);