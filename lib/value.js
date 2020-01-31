"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Value {
}
exports.Value = Value;
class Type extends Value {
}
exports.Type = Type;
class StrType extends Value {
}
exports.StrType = StrType;
class Str extends Value {
    constructor(str) {
        super();
        this.str = str;
    }
}
exports.Str = Str;
class Pi extends Value {
    constructor(scope, return_type, scope_env) {
        super();
        this.scope = scope;
        this.return_type = return_type;
        this.scope_env = scope_env;
    }
}
exports.Pi = Pi;
class Fn extends Value {
    constructor(scope, body, scope_env) {
        super();
        this.scope = scope;
        this.body = body;
        this.scope_env = scope_env;
    }
}
exports.Fn = Fn;
class FnCase extends Value {
    constructor(cases) {
        super();
        this.cases = cases;
    }
}
exports.FnCase = FnCase;
class Cl extends Value {
    constructor(defined, scope, scope_env) {
        super();
        this.defined = defined;
        this.scope = scope;
        this.scope_env = scope_env;
    }
}
exports.Cl = Cl;
class Obj extends Value {
    constructor(defined) {
        super();
        this.defined = defined;
    }
}
exports.Obj = Obj;
class The extends Value {
    constructor(t, value) {
        super();
        this.t = t;
        this.value = value;
    }
}
exports.The = The;
class Equation extends Value {
    constructor(t, lhs, rhs) {
        super();
        this.t = t;
        this.lhs = lhs;
        this.rhs = rhs;
    }
}
exports.Equation = Equation;
class Same extends Value {
    constructor(t, value) {
        super();
        this.t = t;
        this.value = value;
    }
}
exports.Same = Same;
var Neutral;
(function (Neutral_1) {
    class Neutral extends Value {
    }
    Neutral_1.Neutral = Neutral;
    class Var extends Neutral {
        constructor(name) {
            super();
            this.name = name;
        }
    }
    Neutral_1.Var = Var;
    class Ap extends Neutral {
        constructor(target, args) {
            super();
            this.target = target;
            this.args = args;
        }
    }
    Neutral_1.Ap = Ap;
    class Dot extends Neutral {
        constructor(target, field_name) {
            super();
            this.target = target;
            this.field_name = field_name;
        }
    }
    Neutral_1.Dot = Dot;
    class Transport extends Neutral {
        constructor(equation, motive, base) {
            super();
            this.equation = equation;
            this.motive = motive;
            this.base = base;
        }
    }
    Neutral_1.Transport = Transport;
})(Neutral = exports.Neutral || (exports.Neutral = {}));
