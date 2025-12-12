import { IS_PART_2 } from "../../utils/env.ts";
import { withCache } from "../../utils/functional.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day11/input.txt");

const data = Object.fromEntries(input.split("\n").map(line => {
	const [from, targets] = line.split(": ")
	return [from, targets.split(" ")]
}));

const countPaths = withCache((node: string, to: string, dac = false, fft = false): number => {
	if (node === to && (!IS_PART_2 || (dac && fft))) {
		return 1;
	}
	return sumBy(data[node] ?? [], target => countPaths(target, to, dac || node === "dac", fft || node === "fft"))
});

console.log(countPaths(IS_PART_2 ? "svr" : "you", "out"))