import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_ap(mod: Mod.Mod, ctx: Ctx.Ctx, ap: Exp.ap): Value.Value {
  const target_t = Exp.infer(mod, ctx, ap.target)
  if (target_t.kind === "Value.pi") {
    const pi = Value.is_pi(mod, ctx, target_t)
    Exp.check(mod, ctx, ap.arg, pi.arg_t)
    const arg = Exp.evaluate(mod, Ctx.to_env(ctx), ap.arg)
    return Value.Closure.apply(pi.ret_t_cl, arg)
  } else if (target_t.kind === "Value.type") {
    const target = Exp.evaluate(mod, Ctx.to_env(ctx), ap.target)
    const cls = Value.is_cls(mod, ctx, target)
    if (cls.tel.next === undefined) {
      throw new Trace.Trace(
        ut.aline(`
        |The telescope of the cls is full.
        |`)
      )
    }
    Exp.check(mod, ctx, ap.arg, cls.tel.next.t)
    return Value.type
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, target_t, {
        message: `I am expecting the target_t to be pi or type.`,
      })
    )
  }
}
