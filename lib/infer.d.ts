import * as Exp from "./exp";
import * as Value from "./value";
import * as Env from "./env";
export declare function infer(env: Env.Env, exp: Exp.Exp): Value.Value;
export declare function infer_ap(env: Env.Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value;
export declare function infer_dot(env: Env.Env, target: Exp.Exp, field_name: string): Value.Value;
