import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";
import { withCache } from "../../utils/functional.ts";

const input = await Deno.readTextFile("./src/2024/day19/input.txt");

const [_stock, _designs] = input.split("\n\n");
const stock = _stock.split(", ");
const designs = _designs.split("\n").slice(0, -1);

const isMakable = withCache((design: string): number => {
  while (design) {
    const matches = stock.filter((item) => design.startsWith(item));
    const makable = (match: string) => isMakable(design.replace(match, ""));
    const result = IS_PART_2
      ? sumBy(matches, makable)
      : Number(matches.some(makable));
    return result;
  }
  return 1;
});

const makable = sumBy(designs, isMakable);
console.log(makable);
