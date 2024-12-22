import { sumBy } from "../../utils/math.ts";
import { IS_PART_2 } from "../../utils/env.ts";

const input =
  (await Deno.readTextFile("./src/2024/day9/input.txt")).split("\n")[0];

let id = 0;
const list: string[] = [];
for (let i = 0; i < input.length; ++i) {
  const value = Number(input[i]);
  if (i % 2 !== 0) {
    list.push(...".".repeat(value).split(""));
  } else {
    list.push(...Array.from({ length: value }).fill(`${id}`) as string[]);
    id += 1;
  }
}

let buffer: string[] = [];
const disks: string[][] = [];
for (const item of list) {
  if (buffer[0] === undefined || buffer[0] === item) {
    buffer.push(item);
  } else {
    disks.push(buffer);
    buffer = [item];
  }
}
if (buffer.length) {
  disks.push(buffer);
}

if (IS_PART_2) {
  disks.reverse();
  for (let i = 0; i < disks.length; ++i) {
    const disk = disks[i];
    if (!disk.includes(".")) {
      for (let j = disks.length - 1; j > i; --j) {
        const freeDisk = disks[j];
        const freeIndex = freeDisk.indexOf(".");
        if (freeIndex !== -1) {
          const freeSpace = freeDisk.length - freeIndex;
          if (freeSpace >= disk.length) {
            disks[i] = new Array(disk.length).fill(".");
            disks[j] = [
              ...disks[j].slice(0, freeIndex),
              ...disk,
              ...new Array(freeSpace - disk.length).fill("."),
            ];
            break;
          }
        }
      }
    }
  }
  disks.reverse();
} else {
  while (true) {
    const itemIndex: number = list.findLastIndex((item) => item !== ".");
    const placeIndex = list.indexOf(".");
    if (itemIndex > placeIndex) {
      list[placeIndex] = list[itemIndex];
      list[itemIndex] = ".";
    } else {
      break;
    }
  }
}

console.log(sumBy(
  IS_PART_2 ? disks.flat() : list,
  (item, i) => item === "." ? 0 : i * Number(item),
));
