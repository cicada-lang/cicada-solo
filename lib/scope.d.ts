import * as Exp from "./exp";
export declare class Scope {
    named_entries: Array<[string, Entry.Entry]>;
    constructor(named_entries?: Array<[string, Entry.Entry]>);
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
