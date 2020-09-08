import * as Ty from "../ty";
import * as Value from "../value";
export declare type Ctx = Map<string, {
    t: Ty.Ty;
    value?: Value.Value;
}>;
