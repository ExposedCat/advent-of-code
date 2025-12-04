import { EIGHT_DIRECTIONS } from "../../utils/grid.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2025/day4/input.txt");

const grid = input.trim().split("\n").map((line) => line.split(""));

const ROLL = '@'

const count = (): [number, [number, number][]] => {
	const matched: [number, number][] = [];
	return [sumBy(grid, (line, y) => sumBy(line, (item, x) => {
		if (item !== ROLL) {
			return 0;
		}
		const rollsAround = sumBy(EIGHT_DIRECTIONS, ([dy, dx]) => Number(grid[y + dy]?.[x + dx] === ROLL));
		const matches = rollsAround < 4 ? 1 : 0;
		if (matches) {
			matched.push([y, x] as const);
		}
		return matches;
	})), matched]
};

let result = 0;
while (true) {
	const [removed, list] = count();
	if (removed === 0) {
		break;
	}
	result += removed;
	list.forEach(([y, x]) => grid[y][x] = 'x');
}

console.log(result);