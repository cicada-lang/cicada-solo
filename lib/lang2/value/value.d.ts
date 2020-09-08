import * as Ty from "../ty";
import * as Neutral from "../neutral";
import * as Closure from "../closure";
export declare type Value = pi | fn | sigma | cons | nat | zero | add1 | equal | same | trivial | sole | absurd | str | quote | type | reflection;
export interface pi {
    kind: "Value.pi";
    arg_t: Value;
    closure: Closure.Closure;
}
export declare const pi: (arg_t: Value, closure: Closure.Closure) => pi;
interface fn {
    kind: "Value.fn";
    closure: Closure.Closure;
}
export declare const fn: (closure: Closure.Closure) => fn;
export interface sigma {
    kind: "Value.sigma";
    car_t: Value;
    closure: Closure.Closure;
}
export declare const sigma: (car_t: Value, closure: Closure.Closure) => sigma;
interface cons {
    kind: "Value.cons";
    car: Value;
    cdr: Value;
}
export declare const cons: (car: Value, cdr: Value) => cons;
export interface nat {
    kind: "Value.nat";
}
export declare const nat: nat;
interface zero {
    kind: "Value.zero";
}
export declare const zero: zero;
interface add1 {
    kind: "Value.add1";
    prev: Value;
}
export declare const add1: (prev: Value) => add1;
export interface equal {
    kind: "Value.equal";
    t: Ty.Ty;
    from: Value;
    to: Value;
}
export declare const equal: (t: Ty.Ty, from: Value, to: Value) => equal;
interface same {
    kind: "Value.same";
}
export declare const same: same;
export interface trivial {
    kind: "Value.trivial";
}
export declare const trivial: trivial;
interface sole {
    kind: "Value.sole";
}
export declare const sole: sole;
export interface absurd {
    kind: "Value.absurd";
}
export declare const absurd: absurd;
export interface str {
    kind: "Value.str";
}
export declare const str: str;
interface quote {
    kind: "Value.quote";
    str: string;
}
export declare const quote: (str: string) => quote;
export interface type {
    kind: "Value.type";
}
export declare const type: type;
interface reflection {
    kind: "Value.reflection";
    t: Ty.Ty;
    neutral: Neutral.Neutral;
}
export declare const reflection: (t: Ty.Ty, neutral: Neutral.Neutral) => reflection;
export {};
