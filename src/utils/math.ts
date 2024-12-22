export const sumBy = <T>(
  array: T[],
  extractor: (item: T, index: number) => number,
) => array.reduce((sum, item, index) => sum + extractor(item, index), 0);

export const sum = (array: number[]) => sumBy(array, (item) => item);

export function gcd(a: number, b: number) {
  let absA = Math.abs(a);
  let absB = Math.abs(b);
  if (absB > absA) {
    absA = [absB, absB = absA][0];
  }
  while (true) {
    if (absB == 0) return absA;
    absA %= absB;
    if (absA == 0) return absB;
    absB %= absA;
  }
}
