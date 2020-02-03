import * as Exp from "./exp";
import * as Env from "./env";
import * as Scope from "./scope";
import * as Neutral from "./neutral";
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
    scope_env: Env.Env;
    constructor(scope: Scope.Scope, return_type: Exp.Exp, scope_env: Env.Env);
}
export declare class Fn extends Value {
    scope: Scope.Scope;
    body: Exp.Exp;
    scope_env: Env.Env;
    constructor(scope: Scope.Scope, body: Exp.Exp, scope_env: Env.Env);
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
    scope_env: Env.Env;
    constructor(defined: Map<string, {
        t: Value;
        value: Value;
    }>, scope: Scope.Scope, scope_env: Env.Env);
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
export declare class Equation extends Value {
    t: Value;
    lhs: Value;
    rhs: Value;
    constructor(t: Value, lhs: Value, rhs: Value);
}
export declare class Same extends Value {
    t: Value;
    value: Value;
    constructor(t: Value, value: Value);
}
export declare class TheNeutral extends Value {
    t: Value;
    value: Neutral.Neutral;
    constructor(t: Value, value: Neutral.Neutral);
}
