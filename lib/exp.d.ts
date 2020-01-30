import * as Scope from "./scope";
export declare abstract class Exp {
}
export declare class Var extends Exp {
    name: string;
    constructor(name: string);
}
export declare class Type extends Exp {
}
export declare class StrType extends Exp {
}
export declare class Str extends Exp {
    str: string;
    constructor(str: string);
}
export declare class Pi extends Exp {
    scope: Scope.Scope;
    return_type: Exp;
    constructor(scope: Scope.Scope, return_type: Exp);
}
export declare class Fn extends Exp {
    scope: Scope.Scope;
    body: Exp;
    constructor(scope: Scope.Scope, body: Exp);
}
export declare class FnCase extends Exp {
    cases: Array<Fn>;
    constructor(cases: Array<Fn>);
}
export declare class Ap extends Exp {
    target: Exp;
    args: Array<Exp>;
    constructor(target: Exp, args: Array<Exp>);
}
export declare class Cl extends Exp {
    scope: Scope.Scope;
    constructor(scope: Scope.Scope);
}
export declare class Obj extends Exp {
    scope: Scope.Scope;
    constructor(scope: Scope.Scope);
}
export declare class Dot extends Exp {
    target: Exp;
    field_name: string;
    constructor(target: Exp, field_name: string);
}
export declare class Block extends Exp {
    scope: Scope.Scope;
    body: Exp;
    constructor(scope: Scope.Scope, body: Exp);
}
export declare class The extends Exp {
    t: Exp;
    value: Exp;
    constructor(t: Exp, value: Exp);
}
export declare class Equation extends Exp {
    t: Exp;
    lhs: Exp;
    rhs: Exp;
    constructor(t: Exp, lhs: Exp, rhs: Exp);
}
export declare class Same extends Exp {
    t: Exp;
    value: Exp;
    constructor(t: Exp, value: Exp);
}
export declare class Transport extends Exp {
    t: Exp;
    lhs: Exp;
    rhs: Exp;
    equation: Exp;
    motive: Exp;
    value: Exp;
    constructor(t: Exp, lhs: Exp, rhs: Exp, equation: Exp, motive: Exp, value: Exp);
}
