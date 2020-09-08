import * as Ty from "../ty";
import * as Exp from "../exp";
import * as Env from "../env";
import * as Neutral from "../neutral";
export declare type Value = reflection | fn | zero | add1;
interface reflection {
    kind: "Value.reflection";
    t: Ty.Ty;
    neutral: Neutral.Neutral;
}
export declare const reflection: (t: Ty.Ty, neutral: Neutral.Neutral) => reflection;
interface fn {
    kind: "Value.fn";
    name: string;
    ret: Exp.Exp;
    env: Env.Env;
}
export declare const fn: (name: string, ret: Exp.Exp, env: Env.Env) => fn;
interface zero {
    kind: "Value.zero";
}
export declare const zero: zero;
interface add1 {
    kind: "Value.add1";
    prev: Value;
}
export declare const add1: (prev: Value) => add1;
export {};
