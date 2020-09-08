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
exports.evaluate = void 0;
const Exp = __importStar(require("../exp"));
const Value = __importStar(require("../value"));
const Closure = __importStar(require("../closure"));
const Env = __importStar(require("../env"));
const Trace = __importStar(require("../../trace"));
function evaluate(env, exp) {
    try {
        switch (exp.kind) {
            case "Exp.v": {
                const result = Env.lookup(env, exp.name);
                if (result !== undefined) {
                    return result;
                }
                else {
                    throw new Trace.Trace(Exp.explain_name_undefined(exp.name));
                }
            }
            case "Exp.pi": {
                return Value.pi(Exp.evaluate(env, exp.arg_t), new Closure.Closure(env, exp.name, exp.ret_t));
            }
            case "Exp.fn": {
                return Value.fn(new Closure.Closure(env, exp.name, exp.ret));
            }
            case "Exp.ap": {
                return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg));
            }
            case "Exp.sigma": {
                return Value.sigma(Exp.evaluate(env, exp.car_t), new Closure.Closure(env, exp.name, exp.cdr_t));
            }
            case "Exp.cons": {
                return Value.cons(Exp.evaluate(env, exp.car), Exp.evaluate(env, exp.cdr));
            }
            case "Exp.car": {
                return Exp.do_car(evaluate(env, exp.target));
            }
            case "Exp.cdr": {
                return Exp.do_cdr(evaluate(env, exp.target));
            }
            case "Exp.nat": {
                return Value.nat;
            }
            case "Exp.zero": {
                return Value.zero;
            }
            case "Exp.add1": {
                return Value.add1(Exp.evaluate(env, exp.prev));
            }
            case "Exp.nat_ind": {
                return Exp.do_nat_ind(Exp.evaluate(env, exp.target), Exp.evaluate(env, exp.motive), Exp.evaluate(env, exp.base), Exp.evaluate(env, exp.step));
            }
            case "Exp.equal": {
                return Value.equal(Exp.evaluate(env, exp.t), Exp.evaluate(env, exp.from), Exp.evaluate(env, exp.to));
            }
            case "Exp.same": {
                return Value.same;
            }
            case "Exp.replace": {
                return Exp.do_replace(Exp.evaluate(env, exp.target), Exp.evaluate(env, exp.motive), Exp.evaluate(env, exp.base));
            }
            case "Exp.trivial": {
                return Value.trivial;
            }
            case "Exp.sole": {
                return Value.sole;
            }
            case "Exp.absurd": {
                return Value.absurd;
            }
            case "Exp.absurd_ind": {
                return Exp.do_absurd_ind(Exp.evaluate(env, exp.target), Exp.evaluate(env, exp.motive));
            }
            case "Exp.str": {
                return Value.str;
            }
            case "Exp.quote": {
                return Value.quote(exp.str);
            }
            case "Exp.type": {
                return Value.type;
            }
            case "Exp.suite": {
                for (const def of exp.defs) {
                    env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp));
                }
                return evaluate(env, exp.ret);
            }
            case "Exp.the": {
                return Exp.evaluate(env, exp.exp);
            }
        }
    }
    catch (error) {
        Trace.maybe_push(error, exp);
    }
}
exports.evaluate = evaluate;
