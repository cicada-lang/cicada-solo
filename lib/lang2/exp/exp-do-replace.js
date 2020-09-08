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
exports.do_replace = void 0;
const Exp = __importStar(require("../exp"));
const Env = __importStar(require("../env"));
const Value = __importStar(require("../value"));
const Normal = __importStar(require("../normal"));
const Neutral = __importStar(require("../neutral"));
const Closure = __importStar(require("../closure"));
const Trace = __importStar(require("../../trace"));
function do_replace(target, motive, base) {
    if (target.kind === "Value.same") {
        return base;
    }
    else if (target.kind === "Value.reflection") {
        if (target.t.kind === "Value.equal") {
            const base_t = Exp.do_ap(motive, target.t.from);
            const closure = new Closure.Closure(Env.init(), "x", Exp.type);
            const motive_t = Value.pi(target.t.t, closure);
            return Value.reflection(Exp.do_ap(motive, target.t.to), Neutral.replace(target.neutral, new Normal.Normal(motive_t, motive), new Normal.Normal(base_t, base)));
        }
        else {
            throw new Trace.Trace(Exp.explain_elim_target_type_mismatch({
                elim: "replace",
                expecting: ["Value.equal"],
                reality: target.t.kind,
            }));
        }
    }
    else {
        throw new Trace.Trace(Exp.explain_elim_target_mismatch({
            elim: "replace",
            expecting: ["Value.same", "Value.reflection"],
            reality: target.kind,
        }));
    }
}
exports.do_replace = do_replace;
