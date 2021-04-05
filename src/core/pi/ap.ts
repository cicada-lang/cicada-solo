import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { evaluate } from "@/evaluate"
import { infer } from "@/infer"
import { check } from "@/check"
import { Value, match_value } from "@/value"
import { Closure } from "@/closure"
import { expect } from "@/expect"
import { Normal } from "@/normal"
import { NotYetValue } from "@/core"
import { FnValue, PiValue, ApNeutral } from "@/core"
import { ClsValue, TypeValue } from "@/core"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Ap implements Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return Ap.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  static apply(target: Value, arg: Value): Value {
    return match_value(target, {
      FnValue: (fn: FnValue) => fn.ret_cl.apply(arg),
      ClsValue: (cls: ClsValue) => cls.apply(arg),
      NotYetValue: ({ t, neutral }: NotYetValue) =>
        match_value(t, {
          PiValue: (pi: PiValue) =>
            new NotYetValue(
              pi.ret_t_cl.apply(arg),
              new ApNeutral(neutral, new Normal(pi.arg_t, arg))
            ),
        }),
    })
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    if (target_t instanceof PiValue) {
      const pi = target_t
      check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx.to_env(), this.arg)
      return pi.ret_t_cl.apply(arg_value)
    }

    const target = evaluate(ctx.to_env(), this.target)
    if (target instanceof ClsValue) {
      const cls = target
      if (!cls.telescope.next) {
        throw new Trace(
          ut.aline(`
            |The telescope is full.
            |`)
        )
      }
      check(ctx, this.arg, cls.telescope.next.t)
      const arg_value = evaluate(ctx.to_env(), this.arg)
      return new TypeValue()
    }

    throw new Trace(
      ut.aline(`
        |I am expecting value of type: PiValue or ClsValue.
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }
}
