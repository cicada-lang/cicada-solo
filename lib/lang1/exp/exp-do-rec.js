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
exports.do_rec = void 0;
const Exp = __importStar(require("../exp"));
const Ty = __importStar(require("../ty"));
const Trace = __importStar(require("../../trace"));
const Value = __importStar(require("../value"));
const Normal = __importStar(require("../normal"));
const Neutral = __importStar(require("../neutral"));
function do_rec(t, target, base, step) {
    if (target.kind === "Value.zero") {
        return base;
    }
    else if (target.kind === "Value.add1") {
        return Exp.do_ap(Exp.do_ap(step, target.prev), Exp.do_rec(t, target.prev, base, step));
    }
    else if (target.kind === "Value.reflection") {
        if (target.t.kind === "Ty.nat") {
            const step_t = Ty.arrow(Ty.nat, Ty.arrow(t, t));
            return Value.reflection(t, Neutral.rec(t, target.neutral, new Normal.Normal(t, base), new Normal.Normal(step_t, step)));
        }
        else {
            throw new Trace.Trace(Exp.explain_elim_target_type_mismatch({
                elim: "rec",
                expecting: ["Ty.nat"],
                reality: target.t.kind,
            }));
        }
    }
    else {
        throw new Trace.Trace(Exp.explain_elim_target_mismatch({
            elim: "rec",
            expecting: ["Value.zero", "Value.add1", "Value.reflection"],
            reality: target.kind,
        }));
    }
}
exports.do_rec = do_rec;
