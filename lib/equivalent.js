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
        define(["require", "exports", "./value", "./pretty", "./evaluate", "./error"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Value = __importStar(require("./value"));
    const pretty = __importStar(require("./pretty"));
    const evaluate_1 = require("./evaluate");
    const error_1 = require("./error");
    function equivalent(s, t) {
        try {
            if (s instanceof Value.Type && t instanceof Value.Type) { }
            else if (s instanceof Value.StrType && t instanceof Value.StrType) { }
            else if (s instanceof Value.Str && t instanceof Value.Str) {
                if (s.str !== t.str) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between Value.Str and Value.Str\n"
                    ]);
                }
            }
            else if (s instanceof Value.Pi && t instanceof Value.Pi) {
                if (s.scope.arity !== t.scope.arity) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between Value.Pi and Value.Pi\n" +
                            "scope arity mismatch\n" +
                            `s.scope.arity = ${s.scope.arity}\n` +
                            `t.scope.arity = ${t.scope.arity}\n`
                    ]);
                }
                let t_scope_env = t.scope_env;
                let s_scope_env = s.scope_env;
                // t.scope.type_map.zip(s.scope.type_map).foreach {
                //   case ((t_name, t_type), (s_name, s_type)) =>
                //     let t_type_value = evaluate(t_scope_env, t_type)
                //   let s_type_value = evaluate(s_scope_env, s_type)
                //   equivalent(s_type_value, t_type_value)
                //   let unique_var = util.unique_var_from(
                //     s"equivalent:ValuePi:ValuePi:${s_name}${t_name}")
                //   t_scope_env = t_scope_env.ext(unique_var.name, t_type_value, unique_var)
                //   s_scope_env = s_scope_env.ext(unique_var.name, s_type_value, unique_var)
                // }
                let t_return_type_value = evaluate_1.evaluate(t_scope_env, t.return_type);
                let s_return_type_value = evaluate_1.evaluate(s_scope_env, s.return_type);
                equivalent(s_return_type_value, t_return_type_value);
            }
            else if (s instanceof Value.Fn && t instanceof Value.Fn) {
                if (s.scope.arity !== t.scope.arity) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between ValueFn and ValueFn\n" +
                            "scope arity mismatch\n" +
                            `s.scope.arity = ${s.scope.arity}\n` +
                            `t.scope.arity = ${t.scope.arity}\n`
                    ]);
                }
                let t_scope_env = t.scope_env;
                let s_scope_env = s.scope_env;
                // t.scope.type_map.zip(s.scope.type_map).foreach {
                //   case ((t_name, t_type), (s_name, s_type)) =>
                //     let t_type_value = evaluate(t_scope_env, t_type)
                //   let s_type_value = evaluate(s_scope_env, s_type)
                //   equivalent(s_type_value, t_type_value)
                //   let unique_var = util.unique_var_from(
                //     s"equivalent:ValuePi:ValuePi:${s_name}${t_name}")
                //   t_scope_env = t_scope_env.ext(unique_var.name, t_type_value, unique_var)
                //   s_scope_env = s_scope_env.ext(unique_var.name, s_type_value, unique_var)
                // }
                let t_body_value = evaluate_1.evaluate(t_scope_env, t.body);
                let s_body_value = evaluate_1.evaluate(s_scope_env, s.body);
                equivalent(s_body_value, t_body_value);
            }
            else if (s instanceof Value.FnCase && t instanceof Value.FnCase) {
                if (s.cases.length !== t.cases.length) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between Value.FnCase and Value.FnCase\n" +
                            "cases length mismatch\n" +
                            `s.cases.length = ${s.cases.length}\n` +
                            `t.cases.length = ${t.cases.length}\n`
                    ]);
                }
                for (let i = 0; i < s.cases.length; i++) {
                    equivalent(s.cases[i], t.cases[i]);
                }
            }
            else if (s instanceof Value.Cl && t instanceof Value.Cl) {
                equivalent_defined(s.defined, t.defined);
                if (s.scope.arity !== t.scope.arity) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between ValueCl and ValueCl\n" +
                            "scope arity mismatch\n" +
                            `s.scope.arity = ${s.scope.arity}\n` +
                            `t.scope.arity = ${t.scope.arity}\n`
                    ]);
                }
                let t_scope_env = t.scope_env;
                let s_scope_env = s.scope_env;
                // t.scope.type_map.foreach {
                //   case (name, t_type) =>
                //     s.scope.type_map.get(name) match {
                //       case Some(s_type) =>
                //         let t_type_value = evaluate(t_scope_env, t_type)
                //       let s_type_value = evaluate(s_scope_env, s_type)
                //       equivalent(s_type_value, t_type_value)
                //       t_scope_env = t_scope_env.ext(name, t_type_value, NeutralVar(name))
                //       s_scope_env = s_scope_env.ext(name, s_type_value, NeutralVar(name))
                //       case None =>
                //         throw ErrorReport(List(
                //           s"equivalent_scope fail\n" +
                //             s"can not find field_name of t_scope in s_scope\n" +
                //             s"field_name = ${name}\n"
                //         ))
                //     }
                // }
            }
            else if (s instanceof Value.Obj && t instanceof Value.Obj) {
                equivalent_defined(s.defined, t.defined);
            }
            else if (s instanceof Value.Neutral.Var && t instanceof Value.Neutral.Var) {
                if (s.name !== t.name) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between Value.Neutral.Var and Value.Neutral.Var\n" +
                            `${s.name} !== ${t.name}\n`
                    ]);
                }
            }
            else if (s instanceof Value.Neutral.Ap && t instanceof Value.Neutral.Ap) {
                equivalent(s.target, t.target);
                equivalent_list(s.args, t.args);
            }
            else if (s instanceof Value.Neutral.Dot && t instanceof Value.Neutral.Dot) {
                if (s.field_name !== t.field_name) {
                    throw new error_1.ErrorReport([
                        "equivalent fail between Value.Neutral.Dot and Value.Neutral.Dot\n" +
                            `field_name name mismatch\n` +
                            `${s.field_name} !== ${t.field_name}\n`
                    ]);
                }
                else {
                    equivalent(s.target, t.target);
                }
            }
            else {
                throw new error_1.ErrorReport([
                    "equivalent fail\n" +
                        "unhandled class of Value pair\n" +
                        `s class name: ${s.constructor.name}\n` +
                        `t class name: ${t.constructor.name}\n`
                ]);
            }
        }
        catch (error) {
            throw error.prepend("equivalent fail\n" +
                `s: ${pretty.pretty_value(s)}\n` +
                `t: ${pretty.pretty_value(t)}\n`);
        }
    }
    exports.equivalent = equivalent;
    function equivalent_list(s_list, t_list) {
        if (s_list.length !== t_list.length) {
            throw new error_1.ErrorReport([
                "equivalent_list fail\n" +
                    `list length mismatch\n` +
                    `s_list.length = ${s_list.length}\n` +
                    `t_list.length = ${t_list.length}\n`
            ]);
        }
        for (let i = 0; i < s_list.length; i++) {
            let s = s_list[i];
            let t = t_list[i];
            equivalent(s, t);
        }
    }
    exports.equivalent_list = equivalent_list;
    function equivalent_defined(s_defined, t_defined) {
        if (s_defined.size !== t_defined.size) {
            throw new error_1.ErrorReport([
                "equivalent_defined fail\n" +
                    "defined size mismatch\n" +
                    `s_defined.size = ${s_defined.size}\n` +
                    `t_defined.size = ${t_defined.size}\n`
            ]);
        }
        for (let [name, the] of t_defined) {
            let res = s_defined.get(name);
            if (res !== undefined) {
                equivalent(res.t, the.t);
                equivalent(res.value, the.value);
            }
            else {
                throw new error_1.ErrorReport([
                    "equivalent_defined fail\n" +
                        "can not find field_name of t_defined in s_defined\n" +
                        `field_name = ${name}\n`
                ]);
            }
        }
    }
    exports.equivalent_defined = equivalent_defined;
});
