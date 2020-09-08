import * as Exp from "../exp";
import * as Env from "../env";
import * as Neutral from "../neutral";
export declare type Value = fn | reflection;
interface fn {
    kind: "Value.fn";
    name: string;
    ret: Exp.Exp;
    env: Env.Env;
}
export declare const fn: (name: string, ret: Exp.Exp, env: Env.Env) => fn;
interface reflection {
    kind: "Value.reflection";
    neutral: Neutral.Neutral;
}
export declare const reflection: (neutral: Neutral.Neutral) => reflection;
export {};
