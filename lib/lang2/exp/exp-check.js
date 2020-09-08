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
const Value = __importStar(require("../value"));
const Neutral = __importStar(require("../neutral"));
const Closure = __importStar(require("../closure"));
const Ctx = __importStar(require("../ctx"));
const Trace = __importStar(require("../../trace"));
const ut = __importStar(require("../../ut"));
function check(ctx, exp, t) {
    try {
        if (exp.kind === "Exp.fn") {
            // ctx, x: arg_t |- ret <= ret_t
            // ---------------------------
            // ctx |- (x) => ret  <=  (x: arg_t) -> ret_t
            const pi = Value.is_pi(ctx, t);
            const arg = Value.reflection(pi.arg_t, Neutral.v(exp.name));
            const ret_t = Closure.apply(pi.closure, arg);
            ctx = Ctx.clone(ctx);
            ctx = Ctx.extend(ctx, exp.name, pi.arg_t);
            Exp.check(ctx, exp.ret, ret_t);
        }
        else if (exp.kind === "Exp.cons") {
            // ctx |- car <= car_t
            // ctx |- cdr <= cdr_t[car/x]
            // -------------------------
            // ctx |- cons(car, cdr) <= (x: car_t) * cdr_t
            const sigma = Value.is_sigma(ctx, t);
            const car = Exp.evaluate(Ctx.to_env(ctx), exp.car);
            const cdr_t = Closure.apply(sigma.closure, car);
            Exp.check(ctx, exp.car, sigma.car_t);
            Exp.check(ctx, exp.cdr, cdr_t);
        }
        else if (exp.kind === "Exp.same") {
            // ctx |- from == to : t
            // ------------------------
            // ctx |- same <= equal(t, from, to)
            const equal = Value.is_equal(ctx, t);
            if (!Value.convert(ctx, equal.t, equal.from, equal.to)) {
                throw new Trace.Trace(ut.aline(`
          |I am expecting the following two values to be the same ${Exp.repr(Value.readback(ctx, Value.type, equal.t))}.
          |But they are not.
          |from:
          |  ${Exp.repr(Value.readback(ctx, equal.t, equal.from))}
          |to:
          |  ${Exp.repr(Value.readback(ctx, equal.t, equal.to))}
          |`));
            }
        }
        else {
            // ctx |- exp => u
            // ctx |- t == u : type
            // ----------------------
            // ctx |- exp <= t
            const u = Exp.infer(ctx, exp);
            if (!Value.convert(ctx, Value.type, t, u)) {
                throw new Trace.Trace(ut.aline(`
          |I infer the type of ${Exp.repr(exp)} to be ${Exp.repr(Value.readback(ctx, Value.type, u))}.
          |But the given type is ${Exp.repr(Value.readback(ctx, Value.type, t))}.
          |`));
            }
        }
    }
    catch (error) {
        Trace.maybe_push(error, exp);
    }
}
exports.check = check;
