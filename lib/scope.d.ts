import * as Exp from "./exp";
export declare class Scope {
    named_entry_list: Array<[string, ScopeEntry]>;
    constructor(named_entry_list?: Array<[string, ScopeEntry]>);
    get length(): number;
}
export declare abstract class ScopeEntry {
}
export declare class ScopeEntryLet extends ScopeEntry {
    value: Exp.Exp;
    constructor(value: Exp.Exp);
}
export declare class ScopeEntryGiven extends ScopeEntry {
    t: Exp.Exp;
    constructor(t: Exp.Exp);
}
export declare class ScopeEntryDefine extends ScopeEntry {
    t: Exp.Exp;
    value: Exp.Exp;
    constructor(t: Exp.Exp, value: Exp.Exp);
}
