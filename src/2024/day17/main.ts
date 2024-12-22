import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day17/input.txt");

const [_a, _b, _c, _, _program] = input.split("\n");
let A = Number(_a.split(" ")[2]);
let B = Number(_b.split(" ")[2]);
let C = Number(_c.split(" ")[2]);
const program = _program.split(" ")[1].split(",").map(Number);

const combo = (operand: number) =>
  operand <= 3 ? operand : {
    4: A,
    5: B,
    6: C,
  }[operand]!;

function processOperation(opcode: number, operand: number) {
  const result = (kind: "jump" | "output" | "none", value: number) => ({
    kind,
    value,
  });
  switch (opcode) {
    case 0:
      A = Math.floor(A / (2 ** combo(operand)));
      break;
    case 1:
      B ^= operand;
      break;
    case 2:
      B = combo(operand) % 8;
      break;
    case 3:
      return A !== 0 ? result("jump", operand) : result("none", 0);
    case 4:
      B = B ^ C;
      break;
    case 5:
      return result("output", combo(operand) % 8);
    case 6:
      B = Math.floor(A / (2 ** combo(operand)));
      break;
    case 7:
      C = Math.floor(A / (2 ** combo(operand)));
      break;
  }
  return result("none", 0);
}

function run() {
  const output: number[] = [];
  for (let i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    const operand = program[i + 1];
    const { kind, value } = processOperation(opcode, operand);
    if (kind == "jump") {
      i = value - 2;
    } else if (kind == "output") {
      output.push(value);
    }
  }
  return output;
}

if (IS_PART_2) {
  const aWorks = (a: number, i: number): number | null => {
    const output = program.slice(i).join(",");
    A = a;
    const result = run().join(",");
    if (result !== output) return null;
    else if (i === 0) return a;
    for (let offset = 0; offset < 8; ++offset) {
      const offsetResult = aWorks(8 * a + offset, i - 1);
      if (offsetResult !== null) {
        return offsetResult;
      }
    }
    return null;
  };

  for (let i = 1; i < 8; ++i) {
    const result = aWorks(i, program.length - 1);
    if (result !== null) {
      console.log(result);
      Deno.exit(1);
    }
  }
} else {
  console.log(run().join(","));
}
