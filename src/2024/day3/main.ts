import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day3/input.txt");

const sumMuls = (input: string) =>
  input.matchAll(/mul\((\d+?),(\d+?)\)/g).reduce(
    (sum: number, [_, left, right]: RegExpExecArray) =>
      sum + Number(left) * Number(right),
    0,
  );

const output = IS_PART_2
  ? sumBy(
    input.split("do()").map((
      part,
    ) => part.split("don't()")[0]),
    sumMuls,
  )
  : sumMuls(input);

console.log(output);
