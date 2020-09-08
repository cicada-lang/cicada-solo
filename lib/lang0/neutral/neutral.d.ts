import * as Value from "../value";
export declare type Neutral = v | ap;
interface v {
    kind: "Neutral.v";
    name: string;
}
export declare const v: (name: string) => v;
interface ap {
    kind: "Neutral.ap";
    target: Neutral;
    arg: Value.Value;
}
export declare const ap: (target: Neutral, arg: Value.Value) => ap;
export {};
