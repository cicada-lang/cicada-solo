import * as Value from "./value";
export declare function equivalent(s: Value.Value, t: Value.Value): void;
export declare function equivalent_list(s_list: Array<Value.Value>, t_list: Array<Value.Value>): void;
export declare function equivalent_defined(s_defined: Map<string, {
    t: Value.Value;
    value: Value.Value;
}>, t_defined: Map<string, {
    t: Value.Value;
    value: Value.Value;
}>): void;
