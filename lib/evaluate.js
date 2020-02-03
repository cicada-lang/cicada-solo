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
const Err = __importStar(require("./err"));
const infer_1 = require("./infer");
const pretty = __importStar(require("./pretty"));
function evaluate(env, exp) {
    if (exp instanceof Exp.Var) {
        let { name } = exp;
        let value = env.lookup_value(name);
        if (value !== undefined) {
            return value;
        }
        else {
            throw new Err.Report([
                "evaluate fail\n" +
                    `undefined name: ${name}\n`
            ]);
        }
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
        return eliminate_ap(env, evaluate(env, target), args);
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
        return eliminate_dot(env, evaluate(env, target), field_name);
    }
    else if (exp instanceof Exp.Block) {
        let { scope, body } = exp;
        return evaluate_block(env, scope, body);
    }
    else if (exp instanceof Exp.The) {
        let { value } = exp;
        return evaluate(env, value);
    }
    else if (exp instanceof Exp.Equation) {
        let { t, lhs, rhs } = exp;
        return new Value.Equation(evaluate(env, t), evaluate(env, lhs), evaluate(env, rhs));
    }
    else if (exp instanceof Exp.Same) {
        let { t, value } = exp;
        return new Value.Same(evaluate(env, t), evaluate(env, value));
    }
    else if (exp instanceof Exp.Transport) {
        let { equation, motive, base } = exp;
        return eliminate_transport(env, evaluate(env, equation), motive, base);
    }
    else {
        throw new Err.Report([
            "evaluate fail\n" +
                `unhandled class of Exp: ${exp.constructor.name}\n` +
                `exp: ${JSON.stringify(exp, null, 2)}\n`
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
            throw new Err.Report([
                "evaluate_obj fail\n" +
                    `scope of Exp.Obj should not contain Entry.Given\n` +
                    `scope: ${pretty.pretty_scope(scope, ", ")}\n` +
                    `name: ${name}\n`
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
            throw new Err.Report([
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
                throw new Err.Report([
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
            throw new Err.Report([
                "evaluate_block fail\n" +
                    `scope of block should not contain Entry.Given\n`
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
            throw new Err.Report([
                "evaluate_block fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return evaluate(local_env, body);
}
exports.evaluate_block = evaluate_block;
function eliminate_ap(env, target, args) {
    if (target instanceof Value.Neutral.The) {
        let the = target;
        return new Value.Neutral.The(the.t, new Value.Neutral.Ap(the.value, args.map(arg => evaluate(env, arg))));
    }
    else if (target instanceof Value.Fn) {
        let { scope, body, scope_env } = target;
        if (scope.arity !== args.length) {
            let args_str = args.map(pretty.pretty_exp).join(", ");
            throw new Err.Report([
                "eliminate_ap fail\n" +
                    "Value.Fn arity mismatch\n" +
                    `scope.arity: ${scope.arity}\n` +
                    `args.length: ${args.length}\n` +
                    `target: ${pretty.pretty_value(target)}\n` +
                    `args: (${args_str})\n`
            ]);
        }
        let new_scope_env = Scope.scope_check_with_args_for_fn(scope, scope_env, args, env);
        return evaluate(new_scope_env, body);
    }
    else if (target instanceof Value.FnCase) {
        let { cases } = target;
        // NOTE find the first checked case
        let fn = cases.find(fn => {
            let { scope, scope_env } = fn;
            try {
                if (scope.arity !== args.length) {
                    throw new Err.Report([
                        "eliminate_ap fail\n" +
                            "Value.FnCase arity mismatch\n" +
                            `scope.arity: ${scope.arity}\n` +
                            `args.length: ${args.length}\n`
                    ]);
                }
                Scope.scope_check_with_args_for_fn(scope, scope_env, args, env);
                return true;
            }
            catch (error) {
                if (error instanceof Err.Report) {
                    {
                        console.log("<eliminate_ap:Value.FnCase>");
                        console.log(error.message, "</eliminate_ap:Value.FnCase>");
                        console.log();
                    }
                    return false;
                }
                else {
                    throw error;
                }
            }
        });
        if (fn === undefined) {
            let s = args.map(pretty.pretty_exp).join(", ");
            let v = args.map(arg => pretty.pretty_value(evaluate(env, arg))).join(", ");
            // NOTE instead of error, should we return Neutral here?
            throw new Err.Report([
                "eliminate_ap fail\n" +
                    "Value.FnCase args mismatch\n" +
                    `target: ${pretty.pretty_value(target)}\n` +
                    `args: (${s})\n` +
                    `arg values: (${v})\n`
            ]);
        }
        else {
            return eliminate_ap(env, fn, args);
        }
    }
    else if (target instanceof Value.Cl) {
        let { defined, scope, scope_env } = target;
        if (scope.arity < args.length) {
            throw new Err.Report([
                "eliminate_ap fail\n" +
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
        throw new Err.Report([
            "eliminate_ap fail\n" +
                "expecting a Value class that can be applied as function\n" +
                `while found Value of class: ${target.constructor.name}\n`
        ]);
    }
}
exports.eliminate_ap = eliminate_ap;
function eliminate_transport(env, target, motive, base) {
    throw new Error();
    // if (target instanceof Value.The) {
    //   let the = target
    //   // NOTE maybe structural `The` like `eliminate_dot`
    //   return eliminate_transport(env, the.value, motive, base)
    // }
    // if (target instanceof Value.) {
    //   TODO
    // }
    // else {
    //   throw new Err.Report([
    //     "eliminate_transport fail\n" +
    //       "expecting Value.Obj\n" +
    //       `while found Value of class: ${target.constructor.name}\n`])
    // }
}
exports.eliminate_transport = eliminate_transport;
function eliminate_dot(env, target, field_name) {
    if (target instanceof Value.Neutral.The) {
        let the = target;
        return new Value.Neutral.The(eliminate_dot(env, the.t, field_name), new Value.Neutral.Dot(the.value, field_name));
    }
    if (target instanceof Value.Obj) {
        let { defined } = target;
        let the = defined.get(field_name);
        if (the !== undefined) {
            return the.value;
        }
        else {
            throw new Err.Report([
                "eliminate_dot fail\n" +
                    "on Value.Obj\n" +
                    `missing field_name: ${field_name}\n` +
                    `target: ${pretty.pretty_value(target)}\n`
            ]);
        }
    }
    else if (target instanceof Value.Cl) {
        let { scope, defined, scope_env } = target;
        let the = defined.get(field_name);
        if (the !== undefined) {
            return the.t;
        }
        let type_map = scope_to_type_map(scope, scope_env);
        let t = type_map.get(field_name);
        if (t !== undefined) {
            return t;
        }
        throw new Err.Report([
            "eliminate_dot fail\n" +
                "on Value.Cl\n" +
                `missing field_name: ${field_name}\n` +
                `target: ${pretty.pretty_value(target)}\n`
        ]);
    }
    else {
        throw new Err.Report([
            "eliminate_dot fail\n" +
                "expecting object or class\n" +
                `while found Value of class: ${target.constructor.name}\n` +
                `target: ${pretty.pretty_value(target)}\n`
        ]);
    }
}
exports.eliminate_dot = eliminate_dot;
function scope_to_type_map(scope, scope_env) {
    let type_map = new Map();
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Scope.Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(scope_env, value),
                value: evaluate(scope_env, value),
            };
            type_map.set(name, the.t);
            scope_env = scope_env.ext(name, the);
        }
        else if (entry instanceof Scope.Entry.Given) {
            let { t } = entry;
            let t_value = evaluate(scope_env, t);
            let the = {
                t: t_value,
                value: new Value.Neutral.The(t_value, new Value.Neutral.Var(name)),
            };
            type_map.set(name, the.t);
            scope_env = scope_env.ext(name, the);
        }
        else if (entry instanceof Scope.Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate(scope_env, t),
                value: evaluate(scope_env, value),
            };
            type_map.set(name, the.t);
            scope_env = scope_env.ext(name, the);
        }
        else {
            throw new Error("scope_to_type_map fail\n" +
                `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
        }
    }
    return type_map;
}
exports.scope_to_type_map = scope_to_type_map;
