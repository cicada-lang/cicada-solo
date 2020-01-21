import * as Exp from "./exp";
import * as Value from "./value";
import * as Env from "./env";
export declare class Scope {
    named_entries: Array<[string, Entry.Entry]>;
    constructor(named_entries?: Array<[string, Entry.Entry]>);
    get arity(): number;
    lookup_value(name: string): undefined | Exp.Exp;
}
export declare namespace Entry {
    abstract class Entry {
    }
    class Let extends Entry {
        value: Exp.Exp;
        constructor(value: Exp.Exp);
    }
    class Given extends Entry {
        t: Exp.Exp;
        constructor(t: Exp.Exp);
    }
    class Define extends Entry {
        t: Exp.Exp;
        value: Exp.Exp;
        constructor(t: Exp.Exp, value: Exp.Exp);
    }
}
export declare function entry_to_type(env: Env.Env, entry: Entry.Entry): Value.Value;
