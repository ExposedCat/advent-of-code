import { range } from "../../utils/constructions.ts";

const input = await Deno.readTextFile("./src/2025/day9/input.txt");

const list = input.trim().split("\n").map(line => line.split(',').map(Number))

let max = -1
range(list.length, (i) => {
  range(list.length - i - 1, (j) => {
    const source = list[i]
    const target = list[i + j + 1]
    const area = Math.abs(source[0] - target[0] + 1) * Math.abs(source[1] - target[1] + 1)
    max = Math.max(max, area)
  })
})

console.log(max)