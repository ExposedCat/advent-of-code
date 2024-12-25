import { sumBy } from "../../utils/math.ts";

const input = await Deno.readTextFile("./src/2024/day25/input.txt");

type Item = {
  kind: "lock" | "key";
  heights: number[];
};

const [locks, keys] = input.split("\n\n").reduce<[Item[], Item[]]>(
  (lists, schema) => {
    const lines = schema.split("\n");
    const kind = lines.at(0)?.includes("#") && !lines.at(-1)?.includes("#")
      ? "lock"
      : "key";
    const heights: number[] = [null!, null!, null!, null!, null!];
    for (
      let y = kind === "lock" ? 1 : 5;
      kind === "lock" ? y < 6 : y > 0;
      y += kind === "lock" ? 1 : -1
    ) {
      for (let x = 0; x < 5; ++x) {
        if (lines[y][x] === ".") {
          heights[x] ??= kind === "lock" ? y - 1 : (6 - y - 1);
        }
      }
    }
    lists[kind === "key" ? 1 : 0].push({
      kind,
      heights: heights.map((height) => height ?? 5),
    });
    return lists;
  },
  [[], []],
);

const pairs = sumBy(locks, (lock) =>
  sumBy(
    keys,
    (key) => {
      for (let i = 0; i < 5; ++i) {
        if (lock.heights[i] + key.heights[i] > 5) {
          return 0;
        }
      }
      return 1;
    },
  ));

console.log(pairs);
