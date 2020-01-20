import * as Exp from "./exp";
import * as Value from "./value";
import { Env } from "./env";
export declare function infer(env: Env, exp: Exp.Exp): Value.Value;
