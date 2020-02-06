"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Value = __importStar(require("./value"));
// NOTE maybe `Neutral` should not extends `Value`.
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
    constructor(target, field_name) {
        super();
        this.target = target;
        this.field_name = field_name;
    }
}
exports.Dot = Dot;
class Transport extends Neutral {
    constructor(equation, motive, base) {
        super();
        this.equation = equation;
        this.motive = motive;
        this.base = base;
    }
}
exports.Transport = Transport;
