import * as Exp from "./exp";
import * as Value from "./value";
import { Env } from "./env";
export declare function evaluate(env: Env, exp: Exp.Exp): Value.Value;
export declare function evaluate_ap(env: Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value;
export declare function evaluate_dot(env: Env, target: Exp.Exp, field: string): Value.Value;
