import { IS_PART_2 } from "../../utils/env.ts";
import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2024/day1/input.txt");

const result = input.split("\n");

const [left, right] = result.reduce(([left, right], item) => {
  const leftItem = item.split(" ").at(0);
  const rightItem = item.split(" ").at(-1);
  if (leftItem !== "") {
    left.push(+leftItem!);
    right.push(+rightItem!);
  }
  return [left, right];
}, [[] as number[], [] as number[]]);

left.sort();
right.sort();

const rightMatches: Record<number, number> = {};
for (const item of right) {
  rightMatches[item] ??= 0;
  rightMatches[item] += 1;
}

// Bro can we have zip() in stdlib please
const total = sumBy(
  left,
  (item, i) =>
    IS_PART_2 ? item * (rightMatches[item] ?? 0) : Math.abs(item - right[i]),
);

console.log(total);
