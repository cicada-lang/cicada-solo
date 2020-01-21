import * as Exp from "./exp";
import * as Env from "./env";
import * as Scope from "./scope";
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
    scope: Scope.Scope;
    return_type: Exp.Exp;
    env: Env.Env;
    constructor(scope: Scope.Scope, return_type: Exp.Exp, env: Env.Env);
}
export declare class Fn extends Value {
    scope: Scope.Scope;
    body: Exp.Exp;
    env: Env.Env;
    constructor(scope: Scope.Scope, body: Exp.Exp, env: Env.Env);
}
export declare class FnCase extends Value {
    cases: Array<Fn>;
    constructor(cases: Array<Fn>);
}
export declare class Cl extends Value {
    defined: Map<string, {
        t: Value;
        value: Value;
    }>;
    scope: Scope.Scope;
    env: Env.Env;
    constructor(defined: Map<string, {
        t: Value;
        value: Value;
    }>, scope: Scope.Scope, env: Env.Env);
}
export declare class Obj extends Value {
    defined: Map<string, {
        t: Value;
        value: Value;
    }>;
    constructor(defined: Map<string, {
        t: Value;
        value: Value;
    }>);
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
