"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Value = __importStar(require("./value"));
const Neutral = __importStar(require("./neutral"));
const util = __importStar(require("./util"));
const evaluate_1 = require("./evaluate");
const check_1 = require("./check");
const infer_1 = require("./infer");
const readback_1 = require("./readback");
const Err = __importStar(require("./err"));
class Scope {
    constructor(named_entries = []) {
        this.named_entries = named_entries;
    }
    get arity() {
        let n = 0;
        for (let [_name, entry] of this.named_entries) {
            if (entry instanceof Entry.Given) {
                n += 1;
            }
        }
        return n;
    }
    lookup_value(name) {
        let named_entry = this.named_entries.find(([entry_name, _entry]) => name === entry_name);
        if (named_entry === undefined) {
            return undefined;
        }
        let [_name, entry] = named_entry;
        if (entry instanceof Entry.Let) {
            let { value } = entry;
            return value;
        }
        else if (entry instanceof Entry.Given) {
            return undefined;
        }
        else if (entry instanceof Entry.Define) {
            let { value } = entry;
            return value;
        }
        else {
            throw new Error("Scope.lookup_value fail\n" +
                `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
        }
    }
}
exports.Scope = Scope;
var Entry;
(function (Entry_1) {
    class Entry {
    }
    Entry_1.Entry = Entry;
    class Let extends Entry {
        constructor(value) {
            super();
            this.value = value;
        }
    }
    Entry_1.Let = Let;
    class Given extends Entry {
        constructor(t) {
            super();
            this.t = t;
        }
    }
    Entry_1.Given = Given;
    class Define extends Entry {
        constructor(t, value) {
            super();
            this.t = t;
            this.value = value;
        }
    }
    Entry_1.Define = Define;
})(Entry = exports.Entry || (exports.Entry = {}));
function entry_to_type(entry, env) {
    if (entry instanceof Entry.Let) {
        let { value } = entry;
        return infer_1.infer(env, value);
    }
    else if (entry instanceof Entry.Given) {
        let { t } = entry;
        return evaluate_1.evaluate(env, t);
    }
    else if (entry instanceof Entry.Define) {
        let { t } = entry;
        return evaluate_1.evaluate(env, t);
    }
    else {
        throw new Error("entry_to_type fail\n" +
            `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
    }
}
exports.entry_to_type = entry_to_type;
function scope_check_with_args(scope, scope_env, args, env, effect = _ => { }) {
    let arg_index = 0;
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(scope_env, value),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else if (entry instanceof Entry.Given) {
            let arg = args[arg_index];
            if (arg === undefined) {
                break;
            }
            arg_index += 1;
            let { t } = entry;
            let t_value = evaluate_1.evaluate(scope_env, t);
            check_1.check(env, arg, t_value);
            let arg_value = evaluate_1.evaluate(env, arg); // NOTE use the original `env`
            let the = {
                t: t_value,
                value: arg_value,
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else if (entry instanceof Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate_1.evaluate(scope_env, t),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else {
            throw new Err.Report([
                "scope_check_with_args fail\n" +
                    `unhandled class of Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return scope_env;
}
exports.scope_check_with_args = scope_check_with_args;
function scope_check_with_args_for_fn(scope, scope_env, args, env, effect = _ => { }) {
    let arg_index = 0;
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Entry.Let) {
            let { value } = entry;
            let the = {
                t: infer_1.infer(scope_env, value),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else if (entry instanceof Entry.Given) {
            let arg = args[arg_index];
            if (arg === undefined) {
                break;
            }
            arg_index += 1;
            let { t } = entry;
            let t_value = evaluate_1.evaluate(scope_env, t);
            try {
                check_1.check(env, arg, t_value);
                let arg_value = evaluate_1.evaluate(env, arg); // NOTE use the original `env`
                let the = {
                    t: t_value,
                    value: arg_value,
                };
                scope_env = scope_env.ext(name, the);
                effect(name, the);
            }
            catch (error) {
                if (error instanceof Err.Report) {
                    // NOTE if fail on `arg` give it another chance on `readback(arg_value)`.
                    // NOTE we need to use `The` in given, because of the following readback,
                    //   otherwise readback a free variable will lose,
                    //   we need to add `The` and type on `Neutral.Var` to solve this.
                    // NOTE this might be a bad solution.
                    let arg_value = evaluate_1.evaluate(env, arg); // NOTE use the original `env`
                    check_1.check(env, readback_1.readback(arg_value), t_value);
                    let the = {
                        t: t_value,
                        value: arg_value,
                    };
                    scope_env = scope_env.ext(name, the);
                    effect(name, the);
                }
                else {
                    throw error;
                }
            }
        }
        else if (entry instanceof Entry.Define) {
            let { t, value } = entry;
            let the = {
                t: evaluate_1.evaluate(scope_env, t),
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else {
            throw new Err.Report([
                "scope_check_with_args_for_fn fail\n" +
                    `unhandled class of Entry: ${entry.constructor.name}\n`
            ]);
        }
    }
    return scope_env;
}
exports.scope_check_with_args_for_fn = scope_check_with_args_for_fn;
function scope_check(scope, scope_env, effect = _ => { }) {
    for (let [name, entry] of scope.named_entries) {
        if (entry instanceof Entry.Let) {
            let { value } = entry;
            let t_value = infer_1.infer(scope_env, value);
            let the = {
                t: t_value,
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else if (entry instanceof Entry.Given) {
            let { t } = entry;
            check_1.check(scope_env, t, new Value.Type());
            let t_value = evaluate_1.evaluate(scope_env, t);
            let the = {
                t: t_value,
                value: new Value.TheNeutral(t_value, new Neutral.Var(name)),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else if (entry instanceof Entry.Define) {
            let { t, value } = entry;
            check_1.check(scope_env, t, new Value.Type());
            let t_value = evaluate_1.evaluate(scope_env, t);
            check_1.check(scope_env, value, t_value);
            let the = {
                t: t_value,
                value: evaluate_1.evaluate(scope_env, value),
            };
            scope_env = scope_env.ext(name, the);
            effect(name, the);
        }
        else {
            throw new Error("scope_check fail\n" +
                `unhandled class of Entry: ${entry.constructor.name}\n`);
        }
    }
    return scope_env;
}
exports.scope_check = scope_check;
function scope_compare_given(s_scope, s_scope_env, t_scope, t_scope_env, effect = _ => { }) {
    let s_named_entry_iter = s_scope.named_entries.values();
    let t_named_entry_iter = t_scope.named_entries.values();
    let s_current = undefined;
    let t_current = undefined;
    function step() {
        if (s_current === undefined) {
            let result = s_named_entry_iter.next();
            if (result.value !== undefined) {
                let [name, entry] = result.value;
                if (entry instanceof Entry.Let) {
                    let { value } = entry;
                    let the = {
                        t: infer_1.infer(s_scope_env, value),
                        value: evaluate_1.evaluate(s_scope_env, value),
                    };
                    s_scope_env = s_scope_env.ext(name, the);
                }
                else if (entry instanceof Entry.Given) {
                    let { t } = entry;
                    s_current = [name, t];
                }
                else if (entry instanceof Entry.Define) {
                    let { t, value } = entry;
                    let the = {
                        t: evaluate_1.evaluate(s_scope_env, t),
                        value: evaluate_1.evaluate(s_scope_env, value),
                    };
                    s_scope_env = s_scope_env.ext(name, the);
                }
                else {
                    throw new Err.Report([
                        "scope_compare_given fail to step left scope\n" +
                            `unhandled class of Entry: ${entry.constructor.name}\n`
                    ]);
                }
            }
        }
        if (t_current === undefined) {
            let result = t_named_entry_iter.next();
            if (result.value !== undefined) {
                let [name, entry] = result.value;
                if (entry instanceof Entry.Let) {
                    let { value } = entry;
                    let the = {
                        t: infer_1.infer(t_scope_env, value),
                        value: evaluate_1.evaluate(t_scope_env, value),
                    };
                    t_scope_env = t_scope_env.ext(name, the);
                }
                else if (entry instanceof Entry.Given) {
                    let { t } = entry;
                    t_current = [name, t];
                }
                else if (entry instanceof Entry.Define) {
                    let { t, value } = entry;
                    let the = {
                        t: evaluate_1.evaluate(t_scope_env, t),
                        value: evaluate_1.evaluate(t_scope_env, value),
                    };
                    t_scope_env = t_scope_env.ext(name, the);
                }
                else {
                    throw new Err.Report([
                        "scope_compare_given fail to step right scope\n" +
                            `unhandled class of Entry: ${entry.constructor.name}\n`
                    ]);
                }
            }
        }
        if (s_current === undefined &&
            t_current === undefined) {
            return false;
        }
        else if (s_current !== undefined &&
            t_current !== undefined) {
            let [[s_name, s], [t_name, t]] = [s_current, t_current];
            let s_value = evaluate_1.evaluate(s_scope_env, s);
            let t_value = evaluate_1.evaluate(t_scope_env, t);
            effect(name, s_value, t_value);
            let unique_name = util.unique_name(`${s_name}:${t_name}`);
            let unique_var = new Neutral.Var(unique_name);
            s_scope_env = s_scope_env.ext(s_name, { t: s_value, value: unique_var });
            t_scope_env = t_scope_env.ext(t_name, { t: t_value, value: unique_var });
            s_current = undefined;
            t_current = undefined;
            return true;
        }
        else {
            return true;
        }
    }
    let continue_p = true;
    while (continue_p) {
        continue_p = step();
    }
    return [s_scope_env, t_scope_env];
}
exports.scope_compare_given = scope_compare_given;
