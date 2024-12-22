import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day5/input.txt");

const [_rules, _numbers] = input.split("\n\n");
const rules = _rules.split("\n").map((rule) => rule.split("|").map(Number)) as [
  number,
  number,
][];
const numbers = _numbers.split("\n").map((update) =>
  update.split(",").map(Number)
).slice(0, -1);

const isCorrect = (
  index: number,
  rules: [number, number][],
  targets: number[],
) => {
  const value = targets[index];
  const before = targets.slice(0, index);
  const after = targets.slice(index + 1);

  return before.every((number) =>
    !rules.some(([first, second]) => first === value && second === number)
  ) && after.every((number) =>
    !rules.some(([first, second]) =>
      first === number && second === value
    )
  );
};

const fix = (
  index: number,
  rules: [number, number][],
  targets: number[],
  _wasWrong = false,
) => {
  const current = targets[index];

  const wrongIndex = targets.findIndex((target, targetIndex) =>
    targetIndex !== index &&
    rules.some(([first, second]) =>
      targetIndex <= index
        ? (first === current && second === target)
        : (first === target && second === current)
    )
  );

  if (wrongIndex === -1) {
    return _wasWrong;
  }

  [targets[index], targets[wrongIndex]] = [targets[wrongIndex], current];

  return fix(index, rules, targets, true);
};

const total = sumBy(numbers, (targets) => {
  let correct = true;
  for (let i = 0; i < targets.length - 1; ++i) {
    if (IS_PART_2) {
      if (fix(i, rules, targets)) {
        correct = false;
      }
    } else {
      const indexCorrect = isCorrect(i, rules, targets);
      if (!indexCorrect) {
        correct = false;
        break;
      }
    }
  }
  return (IS_PART_2 ? !correct : correct)
    ? targets[(targets.length / 2) | 0]
    : 0;
});

console.log(total);
