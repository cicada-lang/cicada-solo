"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Value {
    constructor() {
        this.abstract_class_name = "Value";
    }
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
class TheNeutral extends Value {
    constructor(t, value) {
        super();
        this.t = t;
        this.value = value;
    }
}
exports.TheNeutral = TheNeutral;
