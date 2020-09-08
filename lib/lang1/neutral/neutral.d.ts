import * as Ty from "../ty";
import * as Normal from "../normal";
export declare type Neutral = v | ap | rec;
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
interface rec {
    kind: "Neutral.rec";
    ret_t: Ty.Ty;
    target: Neutral;
    base: Normal.Normal;
    step: Normal.Normal;
}
export declare const rec: (ret_t: Ty.Ty, target: Neutral, base: Normal.Normal, step: Normal.Normal) => rec;
export {};
