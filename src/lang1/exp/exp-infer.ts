import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    if (exp.kind === "Exp.v") {
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      } else {
        return t
      }
    } else if (exp.kind === "Exp.ap") {
      const { target, arg } = exp
      const target_t = Exp.infer(ctx, target)
      if (target_t.kind === "Ty.arrow") {
        Exp.check(ctx, arg, target_t.arg_t)
        return target_t.ret_t
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting the target_t to be Ty.arrow,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.suite") {
      const { defs, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const def of defs) {
        Ctx.update(ctx, def.name, Exp.infer(ctx, def.exp))
      }
      return Exp.infer(ctx, ret)
    } else if (exp.kind === "Exp.rec") {
      const { t, target, base, step } = exp
      // NOTE target should always be infered,
      // but it is simple to just check it here,
      // because we already know it should be `Ty.nat`.
      Exp.check(ctx, target, Ty.nat)
      Exp.check(ctx, base, t)
      Exp.check(ctx, step, Ty.arrow(Ty.nat, Ty.arrow(t, t)))
      return t
    } else if (exp.kind === "Exp.the") {
      const the = exp
      Exp.check(ctx, the.exp, the.t)
      return the.t
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
