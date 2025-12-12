import solver from "javascript-lp-solver";

export type LpModel = {
	optimize: string;
	opType: string;
	constraints: Record<string, { min: number; max: number }>;
	variables: Record<string, Record<string, number>>;
	ints: Record<string, number>;
}

type SolverResult = { feasible: boolean; result: number };

const solverTyped = solver as { Solve(model: LpModel): SolverResult };

export const lpSolve = (model: LpModel): SolverResult => {
	return solverTyped.Solve(model);
}