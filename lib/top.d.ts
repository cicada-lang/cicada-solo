import * as Exp from "./exp";
import * as Scope from "./scope";
export declare abstract class Top {
}
export declare class TopNamedScopeEntry extends Top {
    name: string;
    entry: Scope.Entry.Entry;
    constructor(name: string, entry: Scope.Entry.Entry);
}
export declare class TopKeywordRefuse extends Top {
    exp: Exp.Exp;
    t: Exp.Exp;
    constructor(exp: Exp.Exp, t: Exp.Exp);
}
export declare class TopKeywordAccept extends Top {
    exp: Exp.Exp;
    t: Exp.Exp;
    constructor(exp: Exp.Exp, t: Exp.Exp);
}
export declare class TopKeywordShow extends Top {
    exp: Exp.Exp;
    constructor(exp: Exp.Exp);
}
export declare class TopKeywordEq extends Top {
    lhs: Exp.Exp;
    rhs: Exp.Exp;
    constructor(lhs: Exp.Exp, rhs: Exp.Exp);
}
