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
exports.nat_ind_step_t = void 0;
const Exp = __importStar(require("../exp"));
const Env = __importStar(require("../env"));
function nat_ind_step_t(motive) {
    const env = Env.extend(Env.init(), "motive", motive);
    const step_t = Exp.pi("prev", Exp.nat, Exp.pi("almost", Exp.ap(Exp.v("motive"), Exp.v("prev")), Exp.ap(Exp.v("motive"), Exp.add1(Exp.v("prev")))));
    return Exp.evaluate(env, step_t);
}
exports.nat_ind_step_t = nat_ind_step_t;
