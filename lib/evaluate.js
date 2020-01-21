var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./exp", "./value", "./scope", "./infer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Exp = __importStar(require("./exp"));
    const Value = __importStar(require("./value"));
    const Scope = __importStar(require("./scope"));
    const infer_1 = require("./infer");
    function evaluate(env, exp) {
        if (exp instanceof Exp.Var) {
            let { name } = exp;
            let value = env.lookup_value(name);
            return value ? value : new Value.Neutral.Var(name);
        }
        else if (exp instanceof Exp.Type) {
            return new Value.Type();
        }
        else if (exp instanceof Exp.StrType) {
            return new Value.StrType();
        }
        else if (exp instanceof Exp.Str) {
            let { str } = exp;
            return new Value.Str(str);
        }
        else if (exp instanceof Exp.Pi) {
            let { scope, return_type } = exp;
            return new Value.Pi(scope, return_type, env);
        }
        else if (exp instanceof Exp.Fn) {
            let { scope, return_value } = exp;
            return new Value.Fn(scope, return_value, env);
        }
        else if (exp instanceof Exp.FnCase) {
            let { cases } = exp;
            return new Value.FnCase(cases.map(fn => new Value.Fn(fn.scope, fn.return_value, env)));
        }
        else if (exp instanceof Exp.Ap) {
            let { target, args } = exp;
            return evaluate_ap(env, target, args);
        }
        else if (exp instanceof Exp.Cl) {
            let { scope } = exp;
            return evaluate_cl(env, scope);
        }
        else if (exp instanceof Exp.Obj) {
            let { scope } = exp;
            return evaluate_obj(env, scope);
        }
        else if (exp instanceof Exp.Dot) {
            let { target, field } = exp;
            return evaluate_dot(env, target, field);
        }
        else if (exp instanceof Exp.Block) {
            let { scope, return_value } = exp;
            return evaluate_block(env, scope, return_value);
        }
        else {
            throw new Error("evaluate fail\n" +
                `unhandled class of Exp: ${exp.constructor.name}\n`);
        }
    }
    exports.evaluate = evaluate;
    function evaluate_ap(env, target, args) {
        throw new Error("TODO");
    }
    exports.evaluate_ap = evaluate_ap;
    function evaluate_obj(env, scope) {
        let local_env = env;
        let defined = new Map();
        for (let [name, entry] of scope.named_entries) {
            if (entry instanceof Scope.Entry.Let) {
                let { value } = entry;
                let the = {
                    t: infer_1.infer(local_env, value),
                    value: evaluate(local_env, value),
                };
                local_env.ext(name, the);
                defined.set(name, the);
            }
            else if (entry instanceof Scope.Entry.Given) {
                throw new Error("evaluate_obj fail\n" +
                    `scope of Exp.Obj should not contain Entry.Given\n`);
            }
            else if (entry instanceof Scope.Entry.Define) {
                let { t, value } = entry;
                let the = {
                    t: evaluate(local_env, t),
                    value: evaluate(local_env, value),
                };
                local_env.ext(name, the);
                defined.set(name, the);
            }
            else {
                throw new Error("evaluate_obj fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
            }
        }
        return new Value.Obj(defined);
    }
    exports.evaluate_obj = evaluate_obj;
    function evaluate_cl(env, scope) {
        let local_env = env;
        let defined = new Map();
        // TODO need initial evaluate
        //   defined might not be empty
        return new Value.Cl(defined, scope, env);
    }
    exports.evaluate_cl = evaluate_cl;
    function evaluate_block(env, scope, return_value) {
        let local_env = env;
        for (let [name, entry] of scope.named_entries) {
            if (entry instanceof Scope.Entry.Let) {
                let { value } = entry;
                let the = {
                    t: infer_1.infer(local_env, value),
                    value: evaluate(local_env, value),
                };
                local_env.ext(name, the);
            }
            else if (entry instanceof Scope.Entry.Given) {
                throw new Error("evaluate_block fail\n" +
                    `scope of Exp.Obj should not contain Entry.Given\n`);
            }
            else if (entry instanceof Scope.Entry.Define) {
                let { t, value } = entry;
                let the = {
                    t: evaluate(local_env, t),
                    value: evaluate(local_env, value),
                };
                local_env.ext(name, the);
            }
            else {
                throw new Error("evaluate_block fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
            }
        }
        return evaluate(local_env, return_value);
    }
    exports.evaluate_block = evaluate_block;
    function evaluate_dot(env, target, field) {
        throw new Error("TODO");
    }
    exports.evaluate_dot = evaluate_dot;
});
