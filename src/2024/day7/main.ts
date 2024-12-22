import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day7/input.txt");

const equations: [number, number[]][] = input.split("\n").slice(0, -1).map(
  (line) => {
    const [left, right] = line.split(": ");
    return [Number(left), right.split(" ").map(Number)];
  },
);

type Kind = "*" | "+" | "|" | null;

class Operation {
  constructor(public kind: Kind, public value: number) {}
  applyTo(left: number) {
    return this.kind === "*"
      ? left * this.value
      : this.kind === "+"
      ? left + this.value
      : this.kind
      ? Number(`${left}${this.value}`)
      : this.value;
  }
}

function isCorrect(
  kinds: Kind[],
  expected: number,
  list: number[],
  operation: Operation,
  _accumulator?: number,
): boolean {
  const value = list.at(0);
  if (value === undefined) {
    return expected === operation.applyTo(_accumulator!);
  }
  const newAccumulator = operation.applyTo(_accumulator!);
  const nextOperations = kinds.map((kind) => new Operation(kind, value));
  return nextOperations.some((operation) =>
    isCorrect(kinds, expected, list.slice(1), operation, newAccumulator)
  );
}

const total = equations.reduce((sum, [expected, numbers]) =>
  sum + Number(
    isCorrect(
      IS_PART_2 ? ["*", "+", "|"] : ["*", "+"],
      expected,
      numbers.slice(1),
      new Operation(null, numbers.at(0)!),
    ) && expected,
  ), 0);

console.log(total);
