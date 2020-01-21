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
    return_value: Exp;
    constructor(scope: Scope.Scope, return_value: Exp);
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
    field: string;
    constructor(target: Exp, field: string);
}
export declare class Block extends Exp {
    scope: Scope.Scope;
    return_value: Exp;
    constructor(scope: Scope.Scope, return_value: Exp);
}
