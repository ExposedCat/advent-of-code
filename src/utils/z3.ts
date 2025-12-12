import { Arith, Context, init } from "z3-solver";

export async function createZ3Context<T extends string>(name: T): Promise<Context<T>> {
	const { Context } = await init();
	return Context(name);
}

export const z3SumBy = <T extends string>(context: Context<T>, list: Arith<T>[], extractor: (value: Arith<T>) => Arith<T>) => list.reduce((acc, value) => acc.add(extractor(value)), context.Int.val(0));
export const z3Sum = <T extends string>(context: Context<T>, list: Arith<T>[]) => z3SumBy(context, list, (value) => value);