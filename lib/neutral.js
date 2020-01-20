var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./value"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Value = __importStar(require("./value"));
    class Neutral extends Value.Value {
    }
    exports.Neutral = Neutral;
    class Var extends Neutral {
        constructor(name) {
            super();
            this.name = name;
        }
    }
    exports.Var = Var;
    class Ap extends Neutral {
        constructor(target, args) {
            super();
            this.target = target;
            this.args = args;
        }
    }
    exports.Ap = Ap;
    class Dot extends Neutral {
        constructor(target, field) {
            super();
            this.target = target;
            this.field = field;
        }
    }
    exports.Dot = Dot;
});
