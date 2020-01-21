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
        define(["require", "exports", "./exp", "./report", "./evaluate", "./infer", "./subtype", "./pretty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Exp = __importStar(require("./exp"));
    const report_1 = require("./report");
    const evaluate_1 = require("./evaluate");
    const infer_1 = require("./infer");
    const subtype_1 = require("./subtype");
    const pretty = __importStar(require("./pretty"));
    function check(env, exp, t) {
        try {
            if (exp instanceof Exp.Obj) {
                let { scope } = exp;
                check_obj(env, scope);
            }
            else if (exp instanceof Exp.Fn) {
                let { scope, body } = exp;
                check_fn(env, scope, body);
            }
            else if (exp instanceof Exp.FnCase) {
                let { cases } = exp;
                for (let fn of cases) {
                    check(env, fn, t);
                }
            }
            else {
                subtype_1.subtype(infer_1.infer(env, exp), t);
            }
        }
        catch (error) {
            if (error instanceof report_1.Report) {
                throw error.prepend("check fail\n" +
                    `exp: ${pretty.pretty_exp(exp)}\n` +
                    `value: ${pretty.pretty_value(evaluate_1.evaluate(env, exp))}\n` +
                    `type: ${pretty.pretty_value(t)}\n`);
            }
            else {
                throw error;
            }
        }
    }
    exports.check = check;
    function check_obj(env, scope) {
        // case Obj(value_map: ListMap[String, Exp]) =>
        //   t match {
        //     case ValueCl(defined, telescope) =>
        //       // check(local_env, a1, A1)
        //       // a1_value = evaluate(local_env, a1)
        //       // equivalent(a1_value, d1)
        //       // local_env = local_env.ext(x1, A1, a1_value)
        //       // ...
        //       // ------
        //       // check(
        //       //   local_env,
        //       //   { x1 = a1, x2 = a2, ... },
        //       //   { x1 = d1 : A1, x2 = d2 : A2, ... })
        //       var local_env = env
        //       defined.foreach {
        //         case (name, (t_value, d_value)) =>
        //           value_map.get(name) match {
        //             case Some(v) =>
        //               check(local_env, v, t_value)
        //               val v_value = evaluate(local_env, v)
        //               equivalent(v_value, d_value)
        //               local_env = local_env.ext(name, t_value, v_value)
        //             case None =>
        //               throw Report(List(
        //                 s"object does not have the field of defined: ${name}\n"
        //               ))
        //           }
        //       }
        //       // B1_value = evaluate(telescope_env, B1)
        //       // check(local_env, b1, A1_value)
        //       // b1_value = evaluate(local_env, b1)
        //       // local_env = local_env.ext(y1, B1_value, b1_value)
        //       // telescope_env = telescope_env.ext(y1, B1_value, b1_value)
        //       // ...
        //       // ------
        //       // check(
        //       //   local_env,
        //       //   { y1 = b1, y2 = b2, ... },
        //       //   { y1 : B1, y2 : B2, ... } @ telescope_env)
        //       var telescope_env = telescope.env
        //       telescope.type_map.foreach {
        //         case (name, t) =>
        //           value_map.get(name) match {
        //             case Some(v) =>
        //               val t_value = evaluate(telescope_env, t)
        //               check(local_env, v, t_value)
        //               val v_value = evaluate(local_env, v)
        //               local_env = local_env.ext(name, t_value, v_value)
        //               telescope_env = telescope_env.ext(name, t_value, v_value)
        //             case None =>
        //               throw Report(List(
        //                 s"object does not have the field of telescope: ${name}\n"
        //               ))
        //           }
        //       }
        //     case _ =>
        //       throw Report(List(
        //         s"expecting class type\n" +
        //           s"but found: ${pretty_value(t)}\n"
        //       ))
        //   }
    }
    exports.check_obj = check_obj;
    function check_fn(env, scope, body) {
        // case Fn(type_map: ListMap[String, Exp], body: Exp) =>
        //   t match {
        //     case ValuePi(telescope, return_type) =>
        //       // NOTE free variable proof occurs here
        //       //   because in `(x1 : A1)`, `x1` is a free variable
        //       //   it only have type but does not have value
        //       // subtype(evaluate(local_env, A1), evaluate(telescope_env, B1))
        //       // unique_var = unique_var_from(x1, y1)
        //       // local_env = local_env.ext(x1, evaluate(local_env, A1), unique_var)
        //       // telescope_env = telescope_env.ext(y1, evaluate(local_env, A1), unique_var)
        //       // ...
        //       // check(local_env, r, evaluate(telescope_env, R))
        //       // ------
        //       // check(
        //       //   local_env,
        //       //   { x1 : A1, x2 : A2, ... => r },
        //       //   { y1 : B1, y2 : B2, ... -> R } @ telescope_env)
        //       if (type_map.size != telescope.size) {
        //         throw Report(List(
        //           s"Fn and pi type arity mismatch\n" +
        //             s"arity of fn: ${type_map.size}\n" +
        //             s"arity of pi: ${telescope.size}\n"
        //         ))
        //       }
        //       var local_env = env
        //       var telescope_env = telescope.env
        //       telescope.type_map.zip(type_map).foreach {
        //         case ((pi_arg_name, pi_arg_type), (fn_arg_name, fn_arg_type)) =>
        //           val pi_arg_type_value = evaluate(telescope_env, pi_arg_type)
        //           val fn_arg_type_value = evaluate(local_env, fn_arg_type)
        //           subtype(fn_arg_type_value, pi_arg_type_value)
        //           val unique_var = util.unique_var_from(
        //             s"check:Fn:${pi_arg_name}:${fn_arg_name}")
        //           local_env = local_env.ext(fn_arg_name, fn_arg_type_value, unique_var)
        //           telescope_env = telescope_env.ext(pi_arg_name, pi_arg_type_value, unique_var)
        //       }
        //     case _ =>
        //       throw Report(List(
        //         s"expecting pi type\n" +
        //           s"but found: ${pretty_value(t)}\n"
        //       ))
        //   }
    }
    exports.check_fn = check_fn;
});
