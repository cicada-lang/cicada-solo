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
        define(["require", "exports", "./exp", "./value", "./scope", "./report", "./evaluate", "./check", "./readback", "./pretty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Exp = __importStar(require("./exp"));
    const Value = __importStar(require("./value"));
    const Scope = __importStar(require("./scope"));
    const report_1 = require("./report");
    const evaluate_1 = require("./evaluate");
    const check_1 = require("./check");
    const readback_1 = require("./readback");
    const pretty = __importStar(require("./pretty"));
    function infer(env, exp) {
        try {
            if (exp instanceof Exp.Var) {
                let { name } = exp;
                let t = env.lookup_type(name);
                if (t === undefined) {
                    throw new report_1.Report([
                        `can not find var: ${name} in env\n`
                    ]);
                }
                else {
                    return t;
                }
            }
            else if (exp instanceof Exp.Type) {
                return new Value.Type();
            }
            else if (exp instanceof Exp.StrType) {
                return new Value.Type();
            }
            else if (exp instanceof Exp.Str) {
                return new Value.StrType();
            }
            else if (exp instanceof Exp.Pi) {
                let { scope, return_type } = exp;
                // check(local_env, A1, type)
                // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
                // ...
                // check(local_env, R, type)
                // ------
                // infer(local_env, { x1 : A1, x2 : A2, ... -> R }) = type
                let local_env = scope_check(env, scope);
                check_1.check(local_env, return_type, new Value.Type());
                return new Value.Type();
            }
            else if (exp instanceof Exp.Fn) {
                let { scope, body } = exp;
                // local_env = env
                // check(local_env, A1, type)
                // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
                // ...
                // R_value = infer(local_env, r)
                // R = readback(R_value)
                // ------
                // infer(
                //   env,
                //   { x1 : A1, x2 : A2, ... => r }) = { x1 : A1, x2 : A2, ... => R } @ env
                let local_env = scope_check(env, scope);
                let return_type_value = infer(local_env, body);
                let return_type = readback_1.readback(return_type_value);
                return new Value.Pi(scope, return_type, env); // NOTE use `env` instead of `local_env`
            }
            else if (exp instanceof Exp.FnCase) {
                throw new report_1.Report([
                    `the language is not designed to infer the type of Exp.FnCase: ${exp}\n`
                ]);
            }
            else if (exp instanceof Exp.Cl) {
                let { scope } = exp;
                // check(local_env, A1, type)
                // A1_value = evaluate(local_env, A1)
                // check(local_env, d1, A1_value)
                // d1_value = evaluate(local_env, d1)
                // local_env = local_env.ext(x1, A1_value, d1_value)
                // ...
                // check(local_env, B1, type)
                // B1_value = evaluate(local_env, B1)
                // local_env = local_env.ext(y1, B1_value, NeutralVar(y1))
                // ...
                // ------
                // infer(
                //   local_env,
                //   { x1 = d1 : A1, x2 = d2 : A2, ..., y1 : B1, y2 : B2, ... }) = type
                scope_check(env, scope);
                return new Value.Type();
            }
            else if (exp instanceof Exp.Obj) {
                let { scope } = exp;
                // A1 = infer(local_env, a1)
                // a1_value = evaluate(local_env, a1)
                // local_env = local_env.ext(x1, a1_value, A1)
                // ...
                // ------
                // infer(local_env, { x1 = a1, x2 = a2, ... }) =
                //   { x1 = a1_value : A1, x2 = a2_value : A2, ... } @ local_env
                let defined = new Map();
                let local_env = scope_check(env, scope, (name, the) => {
                    defined.set(name, the);
                });
                return new Value.Cl(defined, new Scope.Scope([]), local_env);
            }
            else if (exp instanceof Exp.Ap) {
                let { target, args } = exp;
                return infer_ap(env, target, args);
            }
            else if (exp instanceof Exp.Dot) {
                let { target, field_name } = exp;
                return infer_dot(env, target, field_name);
            }
            else if (exp instanceof Exp.Block) {
                let { scope, body } = exp;
                let local_env = scope_check(env, scope);
                return infer(local_env, body);
            }
            else {
                throw new report_1.Report([
                    "infer fail\n" +
                        `unhandled class of Exp: ${exp.constructor.name}\n`
                ]);
            }
        }
        catch (error) {
            if (error instanceof report_1.Report) {
                throw error.prepend("infer fail\n" +
                    `exp: ${pretty.pretty_exp(exp)}\n` +
                    `value: ${pretty.pretty_value(evaluate_1.evaluate(env, exp))}\n`);
            }
            else {
                throw error;
            }
        }
    }
    exports.infer = infer;
    function scope_check(env, scope, effect = (name, the) => { }) {
        var local_env = env;
        for (let [name, entry] of scope.named_entries) {
            if (entry instanceof Scope.Entry.Let) {
                let { value } = entry;
                let t_value = infer(local_env, value);
                let the = {
                    t: t_value,
                    value: evaluate_1.evaluate(local_env, value),
                };
                local_env = local_env.ext(name, the);
                effect(name, the);
            }
            else if (entry instanceof Scope.Entry.Given) {
                let { t } = entry;
                check_1.check(local_env, t, new Value.Type());
                let the = {
                    t: evaluate_1.evaluate(local_env, t),
                    value: new Value.Neutral.Var(name),
                };
                local_env = local_env.ext(name, the);
                effect(name, the);
            }
            else if (entry instanceof Scope.Entry.Define) {
                let { t, value } = entry;
                check_1.check(local_env, t, new Value.Type());
                let t_value = evaluate_1.evaluate(local_env, t);
                check_1.check(local_env, value, t_value);
                let the = {
                    t: t_value,
                    value: evaluate_1.evaluate(local_env, value),
                };
                local_env = local_env.ext(name, the);
                effect(name, the);
            }
            else {
                throw new Error("scope_check fail\n" +
                    `unhandled class of Scope.Entry: ${entry.constructor.name}\n`);
            }
        }
        return local_env;
    }
    function infer_ap(env, target, args) {
        let t_infered = infer(env, target);
        if (t_infered instanceof Value.Pi) {
            // infer(env, target) match {
            //   // { x1 : A1, x2 : A2, ... -> R } @ scope_env = infer(env, f)
            //   // A1_value = evaluate(scope_env, A1)
            //   // check(env, a1, A1_value)
            //   // scope_env = scope_env.ext(x1, A1_value, evaluate(env, a1))
            //   // ...
            //   // ------
            //   // infer(env, f(a1, a2, ...)) = evaluate(scope_env, R)
            //   case ValuePi(scope: scope, return_type: Exp) =>
            //     if (args.length != scope.size) {
            //       throw Report(List(
            //         s"args and pi type arity mismatch\n" +
            //           s"arity of args: ${args.length}\n" +
            //           s"arity of pi: ${scope.size}\n"
            //       ))
            //     }
            //     var scope_env = scope.env
            //     scope.type_map.zip(args).foreach {
            //       case ((name, t), arg) =>
            //         val t_value = evaluate(scope_env, t)
            //         check(env, arg, t_value)
            //         scope_env = scope_env.ext(name, t_value, evaluate(env, arg))
            //     }
            //     evaluate(scope_env, return_type)
            //   case ValueType() =>
            //     evaluate(env, target) match {
            //       case ValueCl(defined, scope) =>
            //         if (args.length > scope.size) {
            //           throw Report(List(
            //             s"too many arguments to apply class\n" +
            //               s"length of args: ${args.length}\n" +
            //               s"arity of cl: ${scope.size}\n"
            //           ))
            //         }
            //         var scope_env = scope.env
            //         scope.type_map.zip(args).foreach {
            //           case ((name, t), arg) =>
            //             val t_value = evaluate(scope_env, t)
            //             check(env, arg, t_value)
            //             scope_env = scope_env.ext(name, evaluate(env, arg), t_value)
            //         }
            //         ValueType()
            //       case t =>
            //         throw Report(List(
            //           s"expecting ValueCl but found: ${t}\n"
            //         ))
            //     }
            throw new Error("TODO");
        }
        else {
            throw new report_1.Report([
                `expecting type of function-like value, but found type: ${pretty.pretty_value(t_infered)}\n`
            ]);
        }
    }
    exports.infer_ap = infer_ap;
    function infer_dot(env, target, field_name) {
        let t_infered = infer(env, target);
        if (t_infered instanceof Value.Cl) {
            let { defined, scope, scope_env } = t_infered;
            // CASE found `m` in `defined`
            // { ..., m = d : T, ... } @ scope_env = infer(env, e)
            // ------
            // infer(env, e.m) = T
            let the = defined.get(field_name);
            if (the !== undefined) {
                return the.t;
            }
            // CASE found `m` in `scope`
            // { x1 : A1,
            //   x2 : A2, ...
            //   m : T, ... } @ scope_env = infer(env, e)
            // scope_env = scope_env.ext(x1, evaluate(scope_env, T), NeutralVar(x1))
            // ...
            // T_value = evaluate(scope_env, T)
            // ------
            // infer(env, e.m) = T_value
            let result = undefined;
            scope_check(scope_env, scope, (name, the) => {
                // NOTE the last one will be the result
                if (name === field_name) {
                    result = the.t;
                }
            });
            if (result !== undefined) {
                return result;
            }
            else {
                throw new report_1.Report([
                    "infer_dot fail\n" +
                        "on Value.Cl\n" +
                        `target exp: ${pretty.pretty_exp(target)}\n` +
                        `infered target type: ${pretty.pretty_value(t_infered)}\n` +
                        `can not find field_name for dot: ${field_name}\n`
                ]);
            }
        }
        else {
            throw new report_1.Report([
                "expecting class\n" +
                    `found type: ${pretty.pretty_value(t_infered)}\n` +
                    `target: ${pretty.pretty_exp(target)}\n`
            ]);
        }
    }
    exports.infer_dot = infer_dot;
});
