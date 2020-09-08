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
exports.check = void 0;
const Exp = __importStar(require("../exp"));
const Ctx = __importStar(require("../ctx"));
const Ty = __importStar(require("../ty"));
const Trace = __importStar(require("../../trace"));
const ut = __importStar(require("../../ut"));
function check(ctx, exp, t) {
    try {
        if (exp.kind === "Exp.fn") {
            // ctx, x: a |- e <= b
            // ------------------------------
            // ctx |- fn(x, e) <= arrow(a, b)
            if (t.kind === "Ty.arrow") {
                ctx = Ctx.clone(ctx);
                Ctx.extend(ctx, exp.name, t.arg_t);
                Exp.check(ctx, exp.ret, t.ret_t);
                return;
            }
            else {
                throw new Trace.Trace(ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.arrow,
            |but the given type is ${Ty.repr(t)}.
            |`));
            }
        }
        else if (exp.kind === "Exp.zero") {
            // ------------------
            // ctx |- zero <= nat
            if (t.kind === "Ty.nat") {
                return;
            }
            else {
                throw new Trace.Trace(ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.nat,
            |but the given type is ${Ty.repr(t)}.
            |`));
            }
        }
        else if (exp.kind === "Exp.add1") {
            // ctx |- prev <= nat
            // ------------------------
            // ctx |- add1(prev) <= nat
            if (t.kind === "Ty.nat") {
                Exp.check(ctx, exp.prev, t);
                return;
            }
            else {
                throw new Trace.Trace(ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.nat,
            |but the given type is ${Ty.repr(t)}.
            |`));
            }
        }
        else {
            const u = Exp.infer(ctx, exp);
            if (ut.equal(t, u)) {
                return;
            }
            else {
                throw new Trace.Trace(ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I infer the type to be ${Ty.repr(u)},
            |but the given type is ${Ty.repr(t)}.
            |`));
            }
        }
    }
    catch (error) {
        Trace.maybe_push(error, exp);
    }
}
exports.check = check;
