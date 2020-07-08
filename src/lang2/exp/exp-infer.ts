import * as Exp from "../exp"
import * as Value from "../value"
import * as Ty from "../ty"
import * as Closure from "../closure"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    if (exp.kind === "Exp.Var") {
      // a = lookup(x, ctx)
      // ---------------------
      // ctx |- x => a
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      } else {
        return t
      }
    } else if (exp.kind === "Exp.Pi") {
      // ctx |- arg_t <= Type
      // ctx, name: arg_t |- ret_t <= Type
      // ------------------------
      // ctx |- Pi(name, arg_t, ret_t) => Type
      Exp.check(ctx, exp.arg_t, { kind: "Value.Type" })
      const arg_t = Exp.evaluate(Ctx.to_env(ctx), exp.arg_t)
      Exp.check(Ctx.extend(Ctx.clone(ctx), exp.name, arg_t), exp.ret_t, {
        kind: "Value.Type",
      })
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Ap") {
      // ctx |- target => Pi(name, arg_t, ret_t)
      // ctx |- arg <= arg_t
      // ------------------------
      // ctx |- Ap(target, arg) => ret_t[arg/name]
      // TODO Value.is_pi
      // const pi: Value.Pi = Value.is_pi(Exp.infer(ctx, exp.target))
      throw new Error("TODO")
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of ${Exp.repr(exp)}.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
