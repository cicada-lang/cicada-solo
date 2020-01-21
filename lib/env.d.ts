import * as Exp from "./exp";
import * as Value from "./value";
export declare class Env {
    entry_map: Map<string, Entry.Entry>;
    constructor(entry_map?: Map<string, Entry.Entry>);
    lookup_type_and_value(name: string): undefined | {
        t: Value.Value;
        value: Value.Value;
    };
    lookup_type(name: string): undefined | Value.Value;
    lookup_value(name: string): undefined | Value.Value;
    ext(name: string, the: {
        t: Value.Value;
        value: Value.Value;
    }): Env;
    ext_rec(name: string, the: {
        t: Exp.Exp;
        value: Exp.Exp;
        env: Env;
    }): Env;
}
export declare namespace Entry {
    abstract class Entry {
    }
    class DefineRec extends Entry {
        t: Exp.Exp;
        value: Exp.Exp;
        env: Env;
        constructor(t: Exp.Exp, value: Exp.Exp, env: Env);
    }
    class Define extends Entry {
        t: Value.Value;
        value: Value.Value;
        constructor(t: Value.Value, value: Value.Value);
    }
}
