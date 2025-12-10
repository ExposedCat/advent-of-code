export function unorderedCombinations<T>(list: readonly T[], k: number): T[][] {
  const res: T[][] = [];

  const backtrack = (start: number, combo: T[]) => {
    if (combo.length === k) {
      res.push([...combo]);
      return;
    }

    for (let i = start; i < list.length; i++) {
      combo.push(list[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }

  if (k <= 0 || k > list.length) return res;
  backtrack(0, []);
  return res;
}