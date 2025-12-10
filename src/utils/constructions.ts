export const CONTINUE = Symbol('continue')
export const BREAK = Symbol('break')

type EarlyReturn = typeof CONTINUE | typeof BREAK

export const range = <T>(length: number, callback: (value: number) => T | [T, EarlyReturn]) => {
	const results: T[] = []
	for (let i = 0; i < length; i++) {
		const result = callback(i)
		if (Array.isArray(result) && [CONTINUE, BREAK].includes(result[1])) {
			results.push(result[0])
			if (result[1] === CONTINUE) {
				continue
			}
			if (result[1] === BREAK) {
				break
			}
		} else {
			results.push(result as T)
		}
	}
	return results
};
