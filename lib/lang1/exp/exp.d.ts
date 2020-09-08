import * as Ty from "../ty";
export declare type Exp = v | fn | ap | zero | add1 | rec | suite | the;
interface v {
    kind: "Exp.v";
    name: string;
}
export declare const v: (name: string) => v;
interface fn {
    kind: "Exp.fn";
    name: string;
    ret: Exp;
}
export declare const fn: (name: string, ret: Exp) => fn;
interface ap {
    kind: "Exp.ap";
    target: Exp;
    arg: Exp;
}
export declare const ap: (target: Exp, arg: Exp) => ap;
interface suite {
    kind: "Exp.suite";
    defs: Array<{
        name: string;
        exp: Exp;
    }>;
    ret: Exp;
}
export declare const suite: (defs: Array<{
    name: string;
    exp: Exp;
}>, ret: Exp) => suite;
interface zero {
    kind: "Exp.zero";
}
export declare const zero: zero;
interface add1 {
    kind: "Exp.add1";
    prev: Exp;
}
export declare const add1: (prev: Exp) => add1;
interface rec {
    kind: "Exp.rec";
    t: Ty.Ty;
    target: Exp;
    base: Exp;
    step: Exp;
}
export declare const rec: (t: Ty.Ty, target: Exp, base: Exp, step: Exp) => rec;
interface the {
    kind: "Exp.the";
    t: Ty.Ty;
    exp: Exp;
}
export declare const the: (t: Ty.Ty, exp: Exp) => the;
export {};
