import * as Ty from "../ty";
import * as Value from "../value";
export declare class Normal {
    t: Ty.Ty;
    value: Value.Value;
    constructor(t: Ty.Ty, value: Value.Value);
}
