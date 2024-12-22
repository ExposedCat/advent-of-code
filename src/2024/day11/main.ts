import { range } from "../../utils/constructions.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day11/input.txt");

const stones = new Map(input.slice(0, -1).split(" ").map((item) => [item, 1]));

const increase = (map: Map<string, number>, field: string, value: number) => {
  const current = map.get(field) ?? 0;
  map.set(field, current + value);
};

function blink(stones: Map<string, number>) {
  const oldStones = new Map(stones);
  const newStones = new Map();
  for (const stone of oldStones.keys()) {
    const amount = stones.get(stone) ?? 0;
    stones.delete(stone);
    if (stone === "0") {
      increase(newStones, "1", amount);
    } else if (stone.length % 2 === 0) {
      increase(newStones, `${+stone.slice(0, stone.length / 2)}`, amount);
      increase(newStones, `${+stone.slice(stone.length / 2)}`, amount);
    } else {
      increase(newStones, `${Number(stone) * 2024}`, amount);
    }
  }

  for (const [stone, amount] of newStones) {
    increase(stones, stone, amount);
  }
}

const blinks = IS_PART_2 ? 75 : 25;
range(blinks, () => blink(stones));

const total = stones.values().reduce((total, value) => total + value, 0);
console.log(total);
