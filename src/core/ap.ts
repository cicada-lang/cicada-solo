import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Explain from "../explain"
import * as Value from "../value"
import { Normal } from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { NotYetValue } from "./not-yet-value"
import { FnValue } from "./fn-value"
import { PiValue } from "./pi-value"

export class Ap implements Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value.Value {
    return Ap.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  infer(ctx: Ctx): Value.Value {
    const target_t = infer(ctx, this.target)
    const pi = Value.is_pi(ctx, target_t)
    check(ctx, this.arg, pi.arg_t)
    const arg_value = evaluate(ctx.to_env(), this.arg)
    return Value.Closure.apply(pi.ret_t_cl, arg_value)
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}(${this.arg.alpha_repr(ctx)})`
  }

  static apply(target: Value.Value, arg: Value.Value): Value.Value {
    if (target instanceof FnValue) {
      return Value.Closure.apply(target.ret_cl, arg)
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof PiValue) {
        return new NotYetValue(
          Value.Closure.apply(target.t.ret_t_cl, arg),
          Neutral.ap(target.neutral, new Normal(target.t.arg_t, arg))
        )
      } else {
        throw new Trace.Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "ap",
            expecting: ["new PiValue()"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_mismatch({
          elim: "ap",
          expecting: ["Value.fn", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}
