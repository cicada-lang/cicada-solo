import { Exp } from "./exp";
export declare class Scope {
    named_entry_list: Array<[string, ScopeEntry]>;
    constructor(named_entry_list: Array<[string, ScopeEntry]>);
    get length(): number;
}
export declare abstract class ScopeEntry {
}
export declare class ScopeLet extends ScopeEntry {
    value: Exp;
    constructor(value: Exp);
}
export declare class ScopeGiven extends ScopeEntry {
    t: Exp;
    constructor(t: Exp);
}
export declare class ScopeDefine extends ScopeEntry {
    t: Exp;
    value: Exp;
    constructor(t: Exp, value: Exp);
}
