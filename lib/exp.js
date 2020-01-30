"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exp {
}
exports.Exp = Exp;
class Var extends Exp {
    constructor(name) {
        super();
        this.name = name;
    }
}
exports.Var = Var;
class Type extends Exp {
}
exports.Type = Type;
class StrType extends Exp {
}
exports.StrType = StrType;
class Str extends Exp {
    constructor(str) {
        super();
        this.str = str;
    }
}
exports.Str = Str;
class Pi extends Exp {
    constructor(scope, return_type) {
        super();
        this.scope = scope;
        this.return_type = return_type;
    }
}
exports.Pi = Pi;
class Fn extends Exp {
    constructor(scope, body) {
        super();
        this.scope = scope;
        this.body = body;
    }
}
exports.Fn = Fn;
class FnCase extends Exp {
    constructor(cases) {
        super();
        this.cases = cases;
    }
}
exports.FnCase = FnCase;
class Ap extends Exp {
    constructor(target, args) {
        super();
        this.target = target;
        this.args = args;
    }
}
exports.Ap = Ap;
class Cl extends Exp {
    constructor(scope) {
        super();
        this.scope = scope;
    }
}
exports.Cl = Cl;
class Obj extends Exp {
    constructor(scope) {
        super();
        this.scope = scope;
    }
}
exports.Obj = Obj;
class Dot extends Exp {
    constructor(target, field_name) {
        super();
        this.target = target;
        this.field_name = field_name;
    }
}
exports.Dot = Dot;
class Block extends Exp {
    constructor(scope, body) {
        super();
        this.scope = scope;
        this.body = body;
    }
}
exports.Block = Block;
class The extends Exp {
    constructor(t, value) {
        super();
        this.t = t;
        this.value = value;
    }
}
exports.The = The;
class Equation extends Exp {
    constructor(t, lhs, rhs) {
        super();
        this.t = t;
        this.lhs = lhs;
        this.rhs = rhs;
    }
}
exports.Equation = Equation;
class Same extends Exp {
    constructor(t, value) {
        super();
        this.t = t;
        this.value = value;
    }
}
exports.Same = Same;
class Transport extends Exp {
    constructor(t, lhs, rhs, equation, motive, value) {
        super();
        this.t = t;
        this.lhs = lhs;
        this.rhs = rhs;
        this.equation = equation;
        this.motive = motive;
        this.value = value;
    }
}
exports.Transport = Transport;
