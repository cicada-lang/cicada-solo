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
const Env = __importStar(require("../env"));
const Value = __importStar(require("../value"));
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
            case "Exp.fn": {
                return Value.fn(exp.name, exp.ret, env);
            }
            case "Exp.ap": {
                return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg));
            }
            case "Exp.suite": {
                for (const def of exp.defs) {
                    env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp));
                }
                return evaluate(env, exp.ret);
            }
        }
    }
    catch (error) {
        Trace.maybe_push(error, exp);
    }
}
exports.evaluate = evaluate;
