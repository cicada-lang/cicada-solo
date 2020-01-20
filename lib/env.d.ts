import * as Exp from "./exp";
import * as Value from "./value";
export declare class Env {
    entry_map: Map<string, EnvEntry>;
    constructor(entry_map?: Map<string, EnvEntry>);
    lookup_type_and_value(name: string): {
        t: Value.Value;
        value: Value.Value;
    } | undefined;
    lookup_type(name: string): Value.Value | undefined;
    lookup_value(name: string): Value.Value | undefined;
    ext(name: string, t: Value.Value, value: Value.Value): Env;
    ext_recursive(name: string, t: Exp.Exp, value: Exp.Exp, env: Env): Env;
}
export declare abstract class EnvEntry {
}
export declare class EnvEntryRecursiveDefine extends EnvEntry {
    t: Exp.Exp;
    value: Exp.Exp;
    env: Env;
    constructor(t: Exp.Exp, value: Exp.Exp, env: Env);
}
export declare class EnvEntryDefine extends EnvEntry {
    t: Value.Value;
    value: Value.Value;
    constructor(t: Value.Value, value: Value.Value);
}
