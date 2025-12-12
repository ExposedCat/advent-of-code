import { sum, sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day12/input.txt");
const separator = input.lastIndexOf("\n\n");
const piecesRaw = input.slice(0, separator).trim();
const regionsRaw = input.slice(separator + 2).trim();

const pieces = piecesRaw
	.split("\n\n")
	.map(piece =>
		sum(piece
			.trim()
			.split("\n")
			.slice(1)
			.map(line => line.split("#").length - 1))
	);

const regions = regionsRaw
	.split("\n")
	.filter(Boolean)
	.map(line => {
		const [size, requirements] = line.split(": ");
		const [width, height] = size.split("x").map(Number);
		return {
			width,
			height,
			requirements: requirements.split(" ").map(Number),
		};
	});

const result = sumBy(regions, region => {
	const { width, height, requirements } = region;
	const area = width * height;
	const requiredArea = sum(requirements.map((amount, i) => pieces[i] * amount));
	return Number(requiredArea <= area);
})

console.log(result)