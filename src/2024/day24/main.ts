import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day24/input.txt");
const [_init, _operations] = input.split("\n\n");

const gates = new Map(
  _init.split("\n").map((line) => {
    const [gate, value] = line.split(": ");
    return [gate, Number(value)];
  }),
);

type Operation = {
  leftGate: string;
  op: string;
  rightGate: string;
  target: string;
  resolved: boolean;
};

const operations = _operations.split("\n").slice(0, -1).map<Operation>(
  (line) => {
    const [leftGate, op, rightGate, _, target] = line.split(" ");
    return { leftGate, op, rightGate, target, resolved: false };
  },
);

const queue: Operation[] = [];

const process = (operation: Operation, push = true) => {
  if (
    gates.get(operation.leftGate) !== undefined &&
    gates.get(operation.rightGate) !== undefined
  ) {
    const left = gates.get(operation.leftGate)!;
    const right = gates.get(operation.rightGate)!;
    gates.set(
      operation.target,
      operation.op === "AND"
        ? Number(left && right)
        : operation.op === "OR"
        ? Number(left || right)
        : Number(left !== right),
    );
    operation.resolved = true;
    for (const operation of queue) {
      if (!operation.resolved) {
        process(operation, false);
      }
    }
  } else if (push) {
    queue.push(operation);
  }
};

for (const operation of operations) {
  process(operation);
}

console.log(
  parseInt(
    [...gates.keys()].filter((gate) => gate.startsWith("z")).sort()
      .toReversed().map((gate) =>
        gates.get(gate)
      ).join(""),
    2,
  ),
);
