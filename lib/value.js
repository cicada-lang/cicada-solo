(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
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
    })(Neutral = exports.Neutral || (exports.Neutral = {}));
});
