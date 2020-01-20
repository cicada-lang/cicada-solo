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
    class ValueType extends Value {
    }
    exports.ValueType = ValueType;
    class ValueStrType extends Value {
    }
    exports.ValueStrType = ValueStrType;
    class ValueStr extends Value {
        constructor(str) {
            super();
            this.str = str;
        }
    }
    exports.ValueStr = ValueStr;
    class ValuePi extends Value {
        constructor(scope, return_type, env) {
            super();
            this.scope = scope;
            this.return_type = return_type;
            this.env = env;
        }
    }
    exports.ValuePi = ValuePi;
    class ValueFn extends Value {
        constructor(scope, return_value, env) {
            super();
            this.scope = scope;
            this.return_value = return_value;
            this.env = env;
        }
    }
    exports.ValueFn = ValueFn;
    class ValueFnCase extends Value {
        constructor(cases) {
            super();
            this.cases = cases;
        }
    }
    exports.ValueFnCase = ValueFnCase;
    class ValueCl extends Value {
        constructor(scope, env) {
            super();
            this.scope = scope;
            this.env = env;
        }
    }
    exports.ValueCl = ValueCl;
    class ValueObj extends Value {
        constructor(value_map) {
            super();
            this.value_map = value_map;
        }
    }
    exports.ValueObj = ValueObj;
    class Neutral extends Value {
    }
    exports.Neutral = Neutral;
    class NeutralVar extends Neutral {
        constructor(name) {
            super();
            this.name = name;
        }
    }
    exports.NeutralVar = NeutralVar;
    class NeutralAp extends Neutral {
        constructor(target, args) {
            super();
            this.target = target;
            this.args = args;
        }
    }
    exports.NeutralAp = NeutralAp;
    class NeutralDot extends Neutral {
        constructor(target, field) {
            super();
            this.target = target;
            this.field = field;
        }
    }
    exports.NeutralDot = NeutralDot;
});
