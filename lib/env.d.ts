import { Exp } from "./exp";
import { Value } from "./value";
export declare class Env {
    entry_map: Map<string, EnvEntry>;
    constructor(entry_map?: Map<string, EnvEntry>);
    lookup_type_and_value(name: string): [Value, Value] | undefined;
    ext_recursive(name: string, t: Exp, value: Exp, env: Env): Env;
}
export declare abstract class EnvEntry {
}
export declare class EnvEntryRecursiveDefine extends EnvEntry {
    t: Exp;
    value: Exp;
    env: Env;
    constructor(t: Exp, value: Exp, env: Env);
}
export declare class EnvEntryDefine extends EnvEntry {
    t: Value;
    value: Value;
    constructor(t: Value, value: Value);
}
