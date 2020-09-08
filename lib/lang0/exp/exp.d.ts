export declare type Exp = v | fn | ap | suite;
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
export {};
