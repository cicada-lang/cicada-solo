import * as Exp from "./exp";
export declare abstract class Top {
}
export declare class TopLet extends Top {
    name: string;
    exp: Exp.Exp;
    constructor(name: string, exp: Exp.Exp);
}
export declare class TopDefine extends Top {
    name: string;
    t: Exp.Exp;
    exp: Exp.Exp;
    constructor(name: string, t: Exp.Exp, exp: Exp.Exp);
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
    rhs: Exp.Exp;
    lhs: Exp.Exp;
    constructor(rhs: Exp.Exp, lhs: Exp.Exp);
}
