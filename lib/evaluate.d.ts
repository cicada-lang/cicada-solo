import * as Exp from "./exp";
import * as Value from "./value";
import * as Env from "./env";
export declare function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value;
export declare function evaluate_ap(env: Env.Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value;
export declare function evaluate_dot(env: Env.Env, target: Exp.Exp, field: string): Value.Value;
