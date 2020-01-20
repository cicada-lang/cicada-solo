import { Env } from "./env";
import { Exp } from "./exp";
import { Value } from "./value";
export declare function evaluate(env: Env, exp: Exp): Value;
export declare function evaluate_ap(env: Env, exp: Exp): Value;
export declare function evaluate_dot(env: Env, exp: Exp): Value;
