import { readInput } from '../../utils.js'

function parseInput(input: string[]) {
  return input
}

export async function main(extended = false) {
  const input = await readInput(import.meta.url)

  const result = parseInput(input)
    .filter(item => item.length)
    .map(report => report.split(' '))

  const reportSafe = (report: string[], tolerateSingleBad = false): boolean => {
    let direction = null as null | 'up' | 'down'
    for (let i = 1; i < report.length; ++i) {
      const diff = +report[i] - +report[i - 1]
      const localDirection = diff < 0 ? 'down' : 'up'
      direction ??= localDirection
      if (
        localDirection !== direction ||
        Math.abs(diff) < 1 ||
        Math.abs(diff) > 3
      ) {
        if (!tolerateSingleBad) {
          return false
        }
        const toleratedCurrent = [...report]
        toleratedCurrent.splice(i, 1)
        const toleratedPrev = [...report]
        toleratedPrev.splice(i - 1, 1)
        const toleratedFirst = [...report]
        toleratedFirst.splice(0, 1)

        return (
          reportSafe(toleratedCurrent) ||
          reportSafe(toleratedPrev) ||
          reportSafe(toleratedFirst)
        )
      }
    }
    return true
  }

  const safeReports = result.reduce(
    (total, report) => total + +reportSafe(report, extended),
    0
  )

  console.log(`Result: ${safeReports}`)
}

main(true)
