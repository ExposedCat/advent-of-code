import { IS_PART_2 } from "../../utils/env.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day5/input.txt");

const [part1, part2] = input.trim().split("\n\n");
const fresh = part1.split("\n").map(line => line.split("-").map(Number));
const available = part2.split("\n").map(Number);

const START = 1;
const END = 1;

if (IS_PART_2) {
	fresh.sort((range1, range2) => range1[START] - range2[START] || range1[END] - range2[END]);

	const merged: number[][] = [];
	for (const [start, end] of fresh) {
		const last = merged.at(-1);
		if (!last) {
			merged.push([start, end]);
			continue;
		}
	
		if (start <= last[END]) {
			last[END] = Math.max(last[END], end);
			continue;
		}
	
		merged.push([start, end]);
	}
	
	const totalFresh = sumBy(merged, ([start, end]) => end - start + 1);
	console.log(totalFresh);
} else {
	const availableFresh = sumBy(
		available,
		ingredient =>
			fresh.some(([start, end]) => ingredient >= start && ingredient <= end) ? 1 : 0
	);
	console.log(availableFresh);
}
