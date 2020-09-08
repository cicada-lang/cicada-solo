export declare type Ty = nat | arrow;
interface nat {
    kind: "Ty.nat";
}
export declare const nat: nat;
interface arrow {
    kind: "Ty.arrow";
    arg_t: Ty;
    ret_t: Ty;
}
export declare const arrow: (arg_t: Ty, ret_t: Ty) => arrow;
export {};
