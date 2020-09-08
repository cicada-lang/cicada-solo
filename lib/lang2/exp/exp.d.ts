export declare type Exp = v | pi | fn | ap | sigma | cons | car | cdr | nat | zero | add1 | nat_ind | equal | same | replace | trivial | sole | absurd | absurd_ind | str | quote | type | suite | the;
interface v {
    kind: "Exp.v";
    name: string;
}
export declare const v: (name: string) => v;
interface pi {
    kind: "Exp.pi";
    name: string;
    arg_t: Exp;
    ret_t: Exp;
}
export declare const pi: (name: string, arg_t: Exp, ret_t: Exp) => pi;
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
interface sigma {
    kind: "Exp.sigma";
    name: string;
    car_t: Exp;
    cdr_t: Exp;
}
export declare const sigma: (name: string, car_t: Exp, cdr_t: Exp) => sigma;
interface cons {
    kind: "Exp.cons";
    car: Exp;
    cdr: Exp;
}
export declare const cons: (car: Exp, cdr: Exp) => cons;
interface car {
    kind: "Exp.car";
    target: Exp;
}
export declare const car: (target: Exp) => car;
interface cdr {
    kind: "Exp.cdr";
    target: Exp;
}
export declare const cdr: (target: Exp) => cdr;
interface nat {
    kind: "Exp.nat";
}
export declare const nat: nat;
interface zero {
    kind: "Exp.zero";
}
export declare const zero: zero;
interface add1 {
    kind: "Exp.add1";
    prev: Exp;
}
export declare const add1: (prev: Exp) => add1;
interface nat_ind {
    kind: "Exp.nat_ind";
    target: Exp;
    motive: Exp;
    base: Exp;
    step: Exp;
}
export declare const nat_ind: (target: Exp, motive: Exp, base: Exp, step: Exp) => nat_ind;
interface equal {
    kind: "Exp.equal";
    t: Exp;
    from: Exp;
    to: Exp;
}
export declare const equal: (t: Exp, from: Exp, to: Exp) => equal;
interface same {
    kind: "Exp.same";
}
export declare const same: same;
interface replace {
    kind: "Exp.replace";
    target: Exp;
    motive: Exp;
    base: Exp;
}
export declare const replace: (target: Exp, motive: Exp, base: Exp) => replace;
interface trivial {
    kind: "Exp.trivial";
}
export declare const trivial: trivial;
interface sole {
    kind: "Exp.sole";
}
export declare const sole: sole;
interface absurd {
    kind: "Exp.absurd";
}
export declare const absurd: absurd;
interface absurd_ind {
    kind: "Exp.absurd_ind";
    target: Exp;
    motive: Exp;
}
export declare const absurd_ind: (target: Exp, motive: Exp) => absurd_ind;
interface str {
    kind: "Exp.str";
}
export declare const str: str;
interface quote {
    kind: "Exp.quote";
    str: string;
}
export declare const quote: (str: string) => quote;
interface type {
    kind: "Exp.type";
}
export declare const type: type;
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
interface the {
    kind: "Exp.the";
    t: Exp;
    exp: Exp;
}
export declare const the: (t: Exp, exp: Exp) => the;
export {};
