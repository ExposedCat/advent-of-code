import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day22/input.txt");

const secretNumbers = input.split("\n").slice(0, -1).map(BigInt);

const mix = (number: bigint, secret: bigint) => number ^ secret;
const prune = (number: bigint) => number % 16777216n;
const nextNumber = (secretNumber: bigint) => {
  secretNumber = prune(mix(secretNumber * 64n, secretNumber));
  secretNumber = prune(mix(secretNumber / 32n, secretNumber));
  return prune(mix(secretNumber * 2048n, secretNumber));
};

let secretTotal = 0n;
const prices: Record<string, bigint>[] = secretNumbers.map(() => ({}));
for (let i = 0; i < secretNumbers.length; ++i) {
  let secretNumber = secretNumbers[i];
  const lastPrices: bigint[] = [];
  for (let j = 0; j < 2000; ++j) {
    const previousPrice = secretNumber % 10n;
    secretNumber = nextNumber(secretNumber);
    const nextPrice = secretNumber % 10n;
    if (lastPrices.length === 4) {
      lastPrices.shift();
    }
    lastPrices.push(nextPrice - previousPrice);
    if (lastPrices.length === 4) {
      prices[i][lastPrices.join(",")] ??= nextPrice;
    }
  }
  secretTotal += secretNumber;
}

if (IS_PART_2) {
  const sequences = new Set(prices.flatMap(Object.keys));
  let maxSequence = "none";
  let max = -0n;
  for (const sequence of sequences) {
    const total = prices.reduce(
      (sum, price) => sum + (price[sequence] ?? 0n),
      0n,
    );
    if (total > max || maxSequence === "none") {
      maxSequence = sequence;
      max = total;
    }
  }

  console.log(maxSequence, Number(max));
} else {
  console.log(Number(secretTotal));
}
