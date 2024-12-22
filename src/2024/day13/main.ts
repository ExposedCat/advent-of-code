import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day13/input.txt");

type Machine = {
  a: { x: number; y: number };
  b: { x: number; y: number };
  prize: { x: number; y: number };
};

const modifier = IS_PART_2 ? 10000000000000 : 0;

const machines = input.split("\n\n").map<Machine>((machine) => {
  const [a, b, prize] = machine.split("\n");
  return {
    a: {
      x: Number.parseInt(a.split("X+")[1]),
      y: Number.parseInt(a.split("Y+")[1]),
    },
    b: {
      x: Number.parseInt(b.split("X+")[1]),
      y: Number.parseInt(b.split("Y+")[1]),
    },
    prize: {
      x: Number.parseInt(prize.split("X=")[1]) + modifier,
      y: Number.parseInt(prize.split("Y=")[1]) + modifier,
    },
  };
});

// Noooooooo you don't need math at school!!!

function calcMinTokens({ prize, a, b }: Machine) {
  // Need to find (m, n) so that both
  //  aX * m + bX * n = pX
  //  aY * m + bY * n = pY

  const m = (prize.y * b.x - b.y * prize.x) / (b.x * a.y - b.y * a.x);
  const n = (prize.x - a.x * m) / b.x;

  return m === Math.floor(m) && n === Math.floor(n) ? m * 3 + n : 0;
}

console.log(sumBy(machines, (machine) => calcMinTokens(machine) ?? 0));
