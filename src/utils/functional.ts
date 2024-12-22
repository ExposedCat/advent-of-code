// deno-lint-ignore no-explicit-any
export const cacheJsonStringify = (args: any[]) => JSON.stringify(args);

// deno-lint-ignore no-explicit-any
export const cacheString = (args: any[]) => args.join(";");

// deno-lint-ignore no-explicit-any
export function withCache<A extends any[], R>(
  fn: (...args: A) => R,
  keyFn: (args: A) => string | number = cacheString,
): (...args: A) => R {
  const cache = new Map<string | number, R>();

  return (...args: A): R => {
    const key = keyFn(args);
    if (cache.has(key)) return cache.get(key)!;

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
