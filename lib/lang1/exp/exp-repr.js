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
const Ty = __importStar(require("../ty"));
const ut = __importStar(require("../../ut"));
function repr(exp) {
    switch (exp.kind) {
        case "Exp.v": {
            return exp.name;
        }
        case "Exp.fn": {
            return `(${exp.name}) => ${repr(exp.ret)}`;
        }
        case "Exp.ap": {
            return `${repr(exp.target)}(${repr(exp.arg)})`;
        }
        case "Exp.suite": {
            const def_reprs = exp.defs.map((def) => `${def.name} = ${repr(def.exp)}`);
            const suite_repr = [...def_reprs, repr(exp.ret)].join("\n");
            return `{\n${ut.indent(suite_repr, "  ")}\n}`;
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
        case "Exp.rec": {
            const { t, target, base, step } = exp;
            return `rec[${Ty.repr(t)}](${repr(target)}, ${repr(base)}, ${repr(step)})`;
        }
        case "Exp.the": {
            const the = exp;
            return `${repr(the.exp)}: ${Ty.repr(the.t)}`;
        }
    }
}
exports.repr = repr;
