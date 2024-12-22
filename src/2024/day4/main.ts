import { range } from "../../utils/constructions.ts";
import { IS_PART_2 } from "../../utils/env.ts";
import { sumBy } from "../../utils/math.ts";

if (!IS_PART_2) {
  console.log(
    `Ugh.. I built P2 on top of P1 so it's kinda lost now.. But you can check part 2 tho!`,
  );
  Deno.exit(1);
}

const input = await Deno.readTextFile("./src/2024/day4/input.txt");

const lines = input.split("\n").slice(0, -1);

const pick = (source: string[], positions: [number, number][]) =>
  positions.map(([y, x]) => source[y]?.[x] ?? "").join(
    "",
  );

const allIncludes = <T>(target: T[], ...items: T[]) =>
  items.every((item) => target.includes(item));

const total = sumBy(lines, (line, y) => {
  let sum = 0;
  range(line.length, (x) => {
    if (line[x] === "M" || line[x] === "S") {
      const left = pick(lines, [[y, x], [y + 1, x + 1], [y + 2, x + 2]]);
      const right = pick(lines, [[y, x + 2], [y + 1, x + 1], [y + 2, x + 0]]);
      if (allIncludes(["MAS", "SAM"], left, right)) {
        sum += 1;
      }
    }
  });
  return sum;
});

console.log(total);
