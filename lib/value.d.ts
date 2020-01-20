import { Env } from "./env";
import * as Exp from "./exp";
import { Scope } from "./scope";
export declare abstract class Value {
}
export declare class Type extends Value {
}
export declare class StrType extends Value {
}
export declare class Str extends Value {
    str: string;
    constructor(str: string);
}
export declare class Pi extends Value {
    scope: Scope;
    return_type: Exp.Exp;
    env: Env;
    constructor(scope: Scope, return_type: Exp.Exp, env: Env);
}
export declare class Fn extends Value {
    scope: Scope;
    return_value: Exp.Exp;
    env: Env;
    constructor(scope: Scope, return_value: Exp.Exp, env: Env);
}
export declare class FnCase extends Value {
    cases: Array<Fn>;
    constructor(cases: Array<Fn>);
}
export declare class Cl extends Value {
    scope: Scope;
    env: Env;
    constructor(scope: Scope, env: Env);
}
export declare class Obj extends Value {
    value_map: Map<string, Value>;
    constructor(value_map: Map<string, Value>);
}
export declare namespace Neutral {
    abstract class Neutral extends Value {
    }
    class Var extends Neutral {
        name: string;
        constructor(name: string);
    }
    class Ap extends Neutral {
        target: Neutral;
        args: Array<Value>;
        constructor(target: Neutral, args: Array<Value>);
    }
    class Dot extends Neutral {
        target: Neutral;
        field: string;
        constructor(target: Neutral, field: string);
    }
}
