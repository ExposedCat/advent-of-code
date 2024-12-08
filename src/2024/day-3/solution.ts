import { readInput, sumBy } from '../../utils.js'

export async function main(_ = false) {
  const input = (await readInput(import.meta.url)).join('')

  const result = sumBy(
    [
      ...input.matchAll(
        /(?:^|do\(\)).*?(?:mul\(\d+?,\d+?\).*?)(?:$|don't\(\))/g
      ),
    ].map(e => e[0]),
    part =>
      sumBy(
        [...part.matchAll(/mul\((\d+?),(\d+?)\)/g)],
        ([_, left, right]) => Number(left) * Number(right)
      )
  )

  console.log(result)
}

main(true)
