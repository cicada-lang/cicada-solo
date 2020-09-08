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
exports.repr = void 0;
const Exp = __importStar(require("../exp"));
const ut = __importStar(require("../../ut"));
function repr(exp) {
    switch (exp.kind) {
        case "Exp.v": {
            return exp.name;
        }
        case "Exp.pi": {
            return `(${exp.name}: ${Exp.repr(exp.arg_t)}) -> ${Exp.repr(exp.ret_t)}`;
        }
        case "Exp.fn": {
            return `(${exp.name}) => ${Exp.repr(exp.ret)}`;
        }
        case "Exp.ap": {
            return `${Exp.repr(exp.target)}(${Exp.repr(exp.arg)})`;
        }
        case "Exp.sigma": {
            return `(${exp.name}: ${Exp.repr(exp.car_t)}) * ${Exp.repr(exp.cdr_t)}`;
        }
        case "Exp.cons": {
            return `cons(${Exp.repr(exp.car)}, ${Exp.repr(exp.cdr)})`;
        }
        case "Exp.car": {
            return `car(${Exp.repr(exp.target)})`;
        }
        case "Exp.cdr": {
            return `cdr(${Exp.repr(exp.target)})`;
        }
        case "Exp.nat": {
            return "Nat";
        }
        case "Exp.zero": {
            return "0";
        }
        case "Exp.add1": {
            const n = Exp.nat_to_number(exp);
            if (n !== undefined) {
                return n.toString();
            }
            else {
                return `add1(${Exp.repr(exp.prev)})`;
            }
        }
        case "Exp.nat_ind": {
            return `Nat.ind(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)}, ${Exp.repr(exp.base)}, ${Exp.repr(exp.step)})`;
        }
        case "Exp.equal": {
            return `Equal(${Exp.repr(exp.t)}, ${Exp.repr(exp.from)}, ${Exp.repr(exp.to)})`;
        }
        case "Exp.same": {
            return "same";
        }
        case "Exp.replace": {
            return `replace(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)}, ${Exp.repr(exp.base)})`;
        }
        case "Exp.trivial": {
            return "Trivial";
        }
        case "Exp.sole": {
            return "sole";
        }
        case "Exp.absurd": {
            return "Absurd";
        }
        case "Exp.absurd_ind": {
            return `Absurd.ind(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)})`;
        }
        case "Exp.str": {
            return "String";
        }
        case "Exp.quote": {
            return `"${exp.str}"`;
        }
        case "Exp.type": {
            return "Type";
        }
        case "Exp.suite": {
            const def_reprs = exp.defs.map((def) => `${def.name} = ${repr(def.exp)}`);
            const suite_repr = [...def_reprs, repr(exp.ret)].join("\n");
            return `{\n${ut.indent(suite_repr, "  ")}\n}`;
        }
        case "Exp.the": {
            return `${Exp.repr(exp.exp)}: ${Exp.repr(exp.t)}`;
        }
    }
}
exports.repr = repr;
