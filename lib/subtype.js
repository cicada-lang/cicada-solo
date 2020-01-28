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
const pretty = __importStar(require("./pretty"));
const Scope = __importStar(require("./scope"));
const equivalent_1 = require("./equivalent");
const evaluate_1 = require("./evaluate");
const Err = __importStar(require("./err"));
function subtype(s, t) {
    try {
        if (s instanceof Value.Pi && t instanceof Value.Pi) {
            // A1_value = evaluate(s_scope_env, A1)
            // B1_value = evaluate(t_scope_env, B1)
            // subtype(B1_value, A1_value) // NOTE contravariant
            // unique_var = unique_var_from(x1, y1)
            // s_scope_env = s_scope_env.ext(x1, A1_value, unique_var)
            // t_scope_env = t_scope_env.ext(y1, B1_value, unique_var)
            // ...
            // S_value = evaluate(s_scope_env, S)
            // R_value = evaluate(t_scope_env, R)
            // subtype(S_value, R_value)
            // ------
            // subtype(
            //   { x1 : A1, x2 : A2, ... -> S } @ s_scope_env,
            //   { y1 : B1, y2 : B2, ... -> R } @ t_scope_env)
            // NOTE only compare `given` in scope
            if (s.scope.arity != t.scope.arity) {
                throw new Err.Report([
                    "subtype fail between Value.Pi and Value.Pi, arity mismatch\n" +
                        `left scope arity: ${s.scope.arity}\n` +
                        `right scope arity: ${t.scope.arity}\n`
                ]);
            }
            let [s_scope_env, t_scope_env] = Scope.scope_compare_given(s.scope, s.scope_env, t.scope, t.scope_env, (name, s_given, t_given) => {
                subtype(t_given, s_given); // NOTE contravariant
            });
            subtype(evaluate_1.evaluate(s_scope_env, s.return_type), evaluate_1.evaluate(t_scope_env, t.return_type));
        }
        else if (s instanceof Value.Cl && t instanceof Value.Cl) {
            // subtype(s_A1, t_A1)
            // equivalent(s_a1, t_a1)
            // ...
            // t_B1_value = evaluate(t_scope_env, t_B1)
            // subtype(s_B1, t_B1_value)
            // t_scope_env = t_scope_env.ext(y1, s_B1, s_b1)
            // ...
            // s_C1_value = evaluate(s_scope_env, s_C1)
            // t_C1_value = evaluate(t_scope_env, t_C1)
            // subtype(s_C1_value, t_C1_value)
            // s_scope_env = s_scope_env.ext(z1, s_C1_value, NeutralVar(z1))
            // t_scope_env = t_scope_env.ext(z1, s_C1_value, NeutralVar(z1))
            // ...
            // ------
            // subtype(
            //   { x1 = s_a1 : s_A1, ..., y1 = s_b1 : s_B1, ..., z1 : s_C1, ...} @ s_scope_env,
            //   { x1 = t_a1 : t_A1, ..., y1        : t_B1, ..., z1 : t_C1, ...} @ t_scope_env)
            let s_defined = new Map([...s.defined]);
            Scope.scope_check(s.scope, s.scope_env, (name, the) => {
                s_defined.set(name, the);
            });
            for (let [name, the] of t.defined) {
                let res = s_defined.get(name);
                if (res !== undefined) {
                    subtype(res.t, the.t);
                    equivalent_1.equivalent(res.value, the.value);
                }
                else {
                    throw new Err.Report([
                        "subtype fail between ValueCl and Value.Cl\n" +
                            `missing name in the subtype class's defined\n` +
                            `name: ${name}\n`
                    ]);
                }
            }
            let t_scope_env = t.scope_env;
            for (let [name, entry] of t.scope.named_entries) {
                let res = s_defined.get(name);
                if (res !== undefined) {
                    if (entry instanceof Scope.Entry.Let) {
                        let { value } = entry;
                        equivalent_1.equivalent(res.value, evaluate_1.evaluate(t_scope_env, value));
                        t_scope_env = t_scope_env.ext(name, res);
                    }
                    else if (entry instanceof Scope.Entry.Given) {
                        let { t } = entry;
                        subtype(res.t, evaluate_1.evaluate(t_scope_env, t));
                        t_scope_env = t_scope_env.ext(name, res);
                    }
                    else if (entry instanceof Scope.Entry.Define) {
                        let { t, value } = entry;
                        subtype(res.t, evaluate_1.evaluate(t_scope_env, t));
                        equivalent_1.equivalent(res.value, evaluate_1.evaluate(t_scope_env, value));
                        t_scope_env = t_scope_env.ext(name, res);
                    }
                    else {
                        throw new Err.Report([
                            "subtype fail\n" +
                                `unhandled class of Scope.Entry: ${entry.constructor.name}`
                        ]);
                    }
                }
                else {
                    throw new Err.Report([
                        "subtype fail\n" +
                            `missing field: ${name}`
                    ]);
                }
            }
        }
        else {
            equivalent_1.equivalent(s, t);
        }
    }
    catch (error) {
        if (error instanceof Err.Report) {
            throw error.prepend("subtype fail\n" +
                `s: ${pretty.pretty_value(s)}\n` +
                `t: ${pretty.pretty_value(t)}\n`);
        }
        else {
            throw error;
        }
    }
}
exports.subtype = subtype;
