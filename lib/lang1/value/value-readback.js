"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readback = void 0;
const freshen_1 = require("./freshen");
const Ty = __importStar(require("../ty"));
const Exp = __importStar(require("../exp"));
const Value = __importStar(require("../value"));
const Neutral = __importStar(require("../neutral"));
const ut = __importStar(require("../../ut"));
// NOTE
// The typed version of the readback procedure
// takes the types into account to perform eta-expansion.
function readback(used, t, value) {
    if (t.kind === "Ty.nat" && value.kind === "Value.zero") {
        return Exp.zero;
    }
    else if (t.kind === "Ty.nat" && value.kind === "Value.add1") {
        return Exp.add1(Value.readback(used, t, value.prev));
    }
    else if (t.kind === "Ty.arrow") {
        // NOTE everything with a function type
        //   is immediately read back as having a Lambda on top.
        //   This implements the η-rule for functions.
        const name = freshen_1.freshen(used, value_arg_name(value));
        const variable = Value.reflection(t.arg_t, Neutral.v(name));
        const ret = Exp.do_ap(value, variable);
        return Exp.fn(name, Value.readback(new Set([...used, name]), t.ret_t, ret));
    }
    else if (value.kind === "Value.reflection") {
        if (ut.equal(t, value.t)) {
            return Neutral.readback(used, value.neutral);
        }
        else {
            throw new Error(ut.aline(`
        |When trying to readback a annotated value: ${ut.inspect(value)},
        |the annotated type is: ${Ty.repr(value.t)},
        |but the given type is ${Ty.repr(t)}.
        |`));
        }
    }
    else {
        throw new Error(ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`));
    }
}
exports.readback = readback;
function value_arg_name(value) {
    return value.kind === "Value.fn" ? value.name : "x";
}
