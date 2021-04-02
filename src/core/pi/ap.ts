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
import { Trace } from "@/trace"
import { NotYetValue } from "@/core"
import { FnValue, PiValue, ApNeutral } from "@/core"

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
    const pi = expect(ctx, target_t, PiValue)
    check(ctx, this.arg, pi.arg_t)
    const arg_value = evaluate(ctx.to_env(), this.arg)
    return pi.ret_t_cl.apply(arg_value)
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }
}
