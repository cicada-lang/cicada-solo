"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exp = __importStar(require("./exp"));
const Value = __importStar(require("./value"));
const Scope = __importStar(require("./scope"));
const error_1 = require("./error");
const infer_1 = require("./infer");
const pretty = __importStar(require("./pretty"));
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
        let { scope, body } = exp;
        return new Value.Fn(scope, body, env);
    }
    else if (exp instanceof Exp.FnCase) {
        let { cases } = exp;
        return new Value.FnCase(cases.map(fn => new Value.Fn(fn.scope, fn.body, env)));
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
        let { target, field_name } = exp;
        return evaluate_dot(env, target, field_name);
    }
    else if (exp instanceof Exp.Block) {
        let { scope, body } = exp;
        return evaluate_block(env, scope, body);
    }
    else {
        throw new error_1.ErrorReport([
            "evaluate fail\n" +
                `unhandled class of Exp: ${exp.constructor.name}\n`
        ]);
    }
}
exports.evaluate = evaluate;
function evaluate_obj(env, scope) {
    // NOTE no telescope semantics here
    //   no `local_env`
    //   just use `env`
    let defined = new Map();
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Scope.Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(env, value),
                value: evaluate(env, value),
            };
            defined.set(name, the);
        }
        else if (entry instanceof Scope.Entry.Given) {
            throw new error_1.ErrorReport([
                "evaluate_obj fail\n" +
                    `scope of Exp.Obj should not contain Entry.Given\n`
            ]);
        }
        else if (entry instanceof Scope.Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate(env, t),
                value: evaluate(env, value),
            };
            defined.set(name, the);
        }
        else {
            throw new error_1.ErrorReport([
                "evaluate_obj fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return new Value.Obj(defined);
}
exports.evaluate_obj = evaluate_obj;
function evaluate_cl(env, scope) {
    let scope_env = env;
    let defined = new Map();
    let named_entries = [];
    let init_definition_finished_p = false;
    for (let [name, entry] of scope.named_entries) {
        if (init_definition_finished_p) {
            named_entries.push([name, entry]);
        }
        else {
            if (entry instanceof Scope.Entry.Let) {
                let { value } = entry;
                let the = {
                    t: infer_1.infer(scope_env, value),
                    value: evaluate(scope_env, value),
                };
                scope_env = scope_env.ext(name, the);
                defined.set(name, the);
            }
            else if (entry instanceof Scope.Entry.Given) {
                named_entries.push([name, entry]);
                init_definition_finished_p = true;
            }
            else if (entry instanceof Scope.Entry.Define) {
                let { t, value } = entry;
                let the = {
                    t: evaluate(scope_env, t),
                    value: evaluate(scope_env, value),
                };
                scope_env = scope_env.ext(name, the);
                defined.set(name, the);
            }
            else {
                throw new error_1.ErrorReport([
                    "evaluate_cl fail\n" +
                        `unhandled class of Scope.Entry: ${entry.constructor.name}\n`
                ]);
            }
        }
    }
    return new Value.Cl(defined, new Scope.Scope(named_entries), scope_env);
}
exports.evaluate_cl = evaluate_cl;
function evaluate_block(env, scope, body) {
    let local_env = env;
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Scope.Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(local_env, value),
                value: evaluate(local_env, value),
            };
            local_env = local_env.ext(name, the);
        }
        else if (entry instanceof Scope.Entry.Given) {
            throw new error_1.ErrorReport([
                "evaluate_block fail\n" +
                    `scope of Exp.Obj should not contain Entry.Given\n`
            ]);
        }
        else if (entry instanceof Scope.Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate(local_env, t),
                value: evaluate(local_env, value),
            };
            local_env = local_env.ext(name, the);
        }
        else {
            throw new error_1.ErrorReport([
                "evaluate_block fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return evaluate(local_env, body);
}
exports.evaluate_block = evaluate_block;
function evaluate_ap(env, target, args) {
    let target_value = evaluate(env, target);
    if (target_value instanceof Value.Neutral.Neutral) {
        return new Value.Neutral.Ap(target_value, args.map(arg => evaluate(env, arg)));
    }
    else if (target_value instanceof Value.Fn) {
        let { scope, body, scope_env } = target_value;
        if (scope.arity !== args.length) {
            throw new error_1.ErrorReport([
                "evaluate_ap fail\n" +
                    "Value.Fn arity mismatch\n" +
                    `scope.arity: ${scope.arity}\n` +
                    `args.length: ${args.length}\n`
            ]);
        }
        let new_scope_env = Scope.scope_check_with_args(scope, scope_env, args, env);
        return evaluate(new_scope_env, body);
    }
    else if (target_value instanceof Value.FnCase) {
        let { cases } = target_value;
        // NOTE find the first checked case
        let fn = cases.find(fn => {
            let { scope, scope_env } = fn;
            try {
                if (scope.arity !== args.length) {
                    throw new error_1.ErrorReport([
                        "evaluate_ap fail\n" +
                            "Value.FnCase arity mismatch\n" +
                            `scope.arity: ${scope.arity}\n` +
                            `args.length: ${args.length}\n`
                    ]);
                }
                Scope.scope_check_with_args(scope, scope_env, args, env);
                return true;
            }
            catch (error) {
                if (error instanceof error_1.ErrorReport) {
                    return false;
                }
                else {
                    throw error;
                }
            }
        });
        if (fn === undefined) {
            let s = args.map(pretty.pretty_exp).join(", ");
            throw new error_1.ErrorReport([
                "evaluate_ap fail\n" +
                    "Value.FnCase mismatch\n" +
                    `target_value: ${pretty.pretty_value(target_value)}\n` +
                    `args: (${s})\n`
            ]);
        }
        else {
            return evaluate_ap(env, fn, args);
        }
    }
    else if (target_value instanceof Value.Cl) {
        let { defined, scope, scope_env } = target_value;
        if (scope.arity < args.length) {
            throw new error_1.ErrorReport([
                "evaluate_ap fail\n" +
                    "too many arguments\n" +
                    `scope.arity: ${scope.arity}\n` +
                    `args.length: ${args.length}\n`
            ]);
        }
        let new_defined = new Map([...defined]);
        let new_named_entries = Array.from(scope.named_entries);
        let new_scope_env = Scope.scope_check_with_args(scope, scope_env, args, env, (name, the) => {
            new_defined.set(name, the);
            new_named_entries.shift();
        });
        return new Value.Cl(new_defined, new Scope.Scope(new_named_entries), new_scope_env);
    }
    else {
        throw new error_1.ErrorReport([
            "evaluate_ap fail\n" +
                "expecting a Value class that can be applied as function\n" +
                `while found Value of class: ${target_value.constructor.name}\n`
        ]);
    }
}
exports.evaluate_ap = evaluate_ap;
function evaluate_dot(env, target, field_name) {
    let target_value = evaluate(env, target);
    if (target_value instanceof Value.Neutral.Neutral) {
        return new Value.Neutral.Dot(target_value, field_name);
    }
    else if (target_value instanceof Value.Obj) {
        let { defined } = target_value;
        let the = defined.get(field_name);
        if (the === undefined) {
            throw new error_1.ErrorReport([
                "evaluate_dot fail\n" +
                    `missing field_name: ${field_name}\n` +
                    `target_value: ${pretty.pretty_value(target_value)}\n`
            ]);
        }
        else {
            return the.value;
        }
    }
    else {
        throw new error_1.ErrorReport([
            "evaluate_dot fail\n" +
                "expecting Value.Obj\n" +
                `while found Value of class: ${target_value.constructor.name}\n`
        ]);
    }
}
exports.evaluate_dot = evaluate_dot;
