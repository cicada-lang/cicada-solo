import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Explain from "../explain"
import { Value } from "../value"
import { Closure } from "../closure"
import { expect } from "../expect"
import { Normal } from "../normal"
import { Trace } from "../trace"
import { NotYetValue } from "../core"
import { FnValue, PiValue, ApNeutral } from "../core"

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

  static apply(target: Value, arg: Value): Value {
    if (target instanceof FnValue) {
      return target.ret_cl.apply(arg)
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof PiValue) {
        return new NotYetValue(
          target.t.ret_t_cl.apply(arg),
          new ApNeutral(target.neutral, new Normal(target.t.arg_t, arg))
        )
      } else {
        throw new Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "ap",
            expecting: ["new PiValue()"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace(
        Explain.explain_elim_target_mismatch({
          elim: "ap",
          expecting: ["Value.fn", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}
