import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day2/input.txt");

const result = input.split("\n")
  .slice(0, -2)
  .map((report) => report.split(" "));

const reportSafe = (report: string[], tolerateSingleBad = false): boolean => {
  let direction = null as null | "up" | "down";
  for (let i = 1; i < report.length; ++i) {
    const diff = +report[i] - +report[i - 1];
    const localDirection = diff < 0 ? "down" : "up";
    direction ??= localDirection;
    if (
      localDirection !== direction ||
      Math.abs(diff) < 1 ||
      Math.abs(diff) > 3
    ) {
      if (!tolerateSingleBad) {
        return false;
      }
      const toleratedCurrent = [...report];
      toleratedCurrent.splice(i, 1);
      const toleratedPrev = [...report];
      toleratedPrev.splice(i - 1, 1);
      const toleratedFirst = [...report];
      toleratedFirst.splice(0, 1);

      return (
        reportSafe(toleratedCurrent) ||
        reportSafe(toleratedPrev) ||
        reportSafe(toleratedFirst)
      );
    }
  }
  return true;
};

const total = sumBy(result, (report) => Number(reportSafe(report, IS_PART_2))) +
  1;

console.log(total);
