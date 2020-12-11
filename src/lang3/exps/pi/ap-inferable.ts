import { Inferable } from "../../inferable"
import * as Evaluate from "../../evaluate"
import { evaluator } from "../../evaluator"
import * as Infer from "../../infer"
import * as Check from "../../check"
import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Mod from "../../mod"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const ap_inferable = (target: Exp.Exp, arg: Exp.Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      const target_t = Infer.infer(mod, ctx, target)
      if (target_t.kind === "Value.pi")
        return when_target_is_pi(mod, ctx, target_t, target, arg)
      if (target_t.kind === "Value.type")
        return when_target_is_type(mod, ctx, target, arg)

      throw new Trace.Trace(
        Value.unexpected(mod, ctx, target_t, {
          message: `I am expecting the target_t to be pi or type.`,
        })
      )
    },
  })

function when_target_is_pi(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi,
  target: Exp.Exp,
  arg: Exp.Exp
): Value.Value {
  Check.check(mod, ctx, arg, pi.arg_t)
  return Value.Closure.apply(
    pi.ret_t_cl,
    evaluator.evaluate(arg, { mod, env: Ctx.to_env(ctx) })
  )
}

function when_target_is_type(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  target: Exp.Exp,
  arg: Exp.Exp
): Value.Value {
  const cls = Value.is_cls(
    mod,
    ctx,
    evaluator.evaluate(target, { mod, env: Ctx.to_env(ctx) })
  )
  if (cls.tel.next === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |The telescope of the cls is full.
        |`)
    )
  }
  Check.check(mod, ctx, arg, cls.tel.next.t)
  return Value.type
}
