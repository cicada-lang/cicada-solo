import { Env } from "./env";
import { Exp } from "./exp";
import { Scope } from "./scope";
export declare abstract class Value {
}
export declare class ValueType extends Value {
}
export declare class ValueStrType extends Value {
}
export declare class ValueStr extends Value {
    str: string;
    constructor(str: string);
}
export declare class ValuePi extends Value {
    scope: Scope;
    return_type: Exp;
    env: Env;
    constructor(scope: Scope, return_type: Exp, env: Env);
}
export declare class ValueFn extends Value {
    scope: Scope;
    return_value: Exp;
    env: Env;
    constructor(scope: Scope, return_value: Exp, env: Env);
}
export declare class ValueFnCase extends Value {
    cases: Array<ValueFn>;
    constructor(cases: Array<ValueFn>);
}
export declare class ValueCl extends Value {
    scope: Scope;
    env: Env;
    constructor(scope: Scope, env: Env);
}
export declare class ValueObj extends Value {
    value_map: Map<string, Value>;
    constructor(value_map: Map<string, Value>);
}
export declare abstract class Neutral extends Value {
}
export declare class NeutralVar extends Neutral {
    name: string;
    constructor(name: string);
}
export declare class NeutralAp extends Neutral {
    target: Neutral;
    args: Array<Value>;
    constructor(target: Neutral, args: Array<Value>);
}
export declare class NeutralDot extends Neutral {
    target: Neutral;
    field: string;
    constructor(target: Neutral, field: string);
}
