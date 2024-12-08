import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export async function readInput(
  metaUrl: string,
  split: string | RegExp = '\n'
) {
  const __filename = fileURLToPath(metaUrl)
  const __dirname = dirname(__filename)
  try {
    const filePath = `${__dirname}/input.txt`
    const input = await readFile(filePath, 'utf8')
    return input.split(split)
  } catch (error) {
    console.error('Ah no, input not found!', { error })
    process.exit(1)
  }
}

export function sumBy<I>(list: I[], func: (element: I, i: number) => number) {
  return list.reduce((sum, element, i) => sum + func(element, i), 0)
}

export function sumArray(list: number[]) {
  return sumBy(list, element => element)
}

export function lastElement<T>(array: T[]): T {
  return array[array.length - 1]
}
