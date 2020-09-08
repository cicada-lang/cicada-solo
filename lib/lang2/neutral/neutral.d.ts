import * as Normal from "../normal";
export declare type Neutral = v | ap | car | cdr | nat_ind | replace | absurd_ind;
interface v {
    kind: "Neutral.v";
    name: string;
}
export declare const v: (name: string) => v;
interface ap {
    kind: "Neutral.ap";
    target: Neutral;
    arg: Normal.Normal;
}
export declare const ap: (target: Neutral, arg: Normal.Normal) => ap;
interface car {
    kind: "Neutral.car";
    target: Neutral;
}
export declare const car: (target: Neutral) => car;
interface cdr {
    kind: "Neutral.cdr";
    target: Neutral;
}
export declare const cdr: (target: Neutral) => cdr;
interface nat_ind {
    kind: "Neutral.nat_ind";
    target: Neutral;
    motive: Normal.Normal;
    base: Normal.Normal;
    step: Normal.Normal;
}
export declare const nat_ind: (target: Neutral, motive: Normal.Normal, base: Normal.Normal, step: Normal.Normal) => nat_ind;
interface replace {
    kind: "Neutral.replace";
    target: Neutral;
    motive: Normal.Normal;
    base: Normal.Normal;
}
export declare const replace: (target: Neutral, motive: Normal.Normal, base: Normal.Normal) => replace;
interface absurd_ind {
    kind: "Neutral.absurd_ind";
    target: Neutral;
    motive: Normal.Normal;
}
export declare const absurd_ind: (target: Neutral, motive: Normal.Normal) => absurd_ind;
export {};
