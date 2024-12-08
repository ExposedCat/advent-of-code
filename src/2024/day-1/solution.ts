import { readInput } from '../../utils.js'

function parseInput(input: string[]) {
  return input
}

export async function main(extended = false) {
  const input = await readInput(import.meta.url)

  const result = parseInput(input)

  const [left, right] = result.reduce(([left, right], item) => {
    const leftItem = item.split(' ').at(0)
    const rightItem = item.split(' ').at(-1)
    if (leftItem !== '') {
      left.push(+leftItem!)
      right.push(+rightItem!)
    }
    return [left, right]
  }, [[] as number[], [] as number[]])

  left.sort()
  right.sort()

  const rightMatches: Record<number, number> = {}
  for (const item of right) {
    rightMatches[item] ??= 0
    rightMatches[item] += 1
  }

  // Bro can we have zip() in stdlib please
  const total = left.reduce((sum, e, i) => sum + (extended ? e * (rightMatches[e] ?? 0) : Math.abs(e - right[i])), 0)

  console.log(total)
}

main(true)
