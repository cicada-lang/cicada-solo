import { Exp, AlphaOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"

export class Ap implements Exp {
  kind = "Ap"
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value.Value {
    return do_ap(evaluate(env, this.target), evaluate(env, this.arg))
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

  alpha_repr(opts: AlphaOpts): string {
    return `${this.target.alpha_repr(opts)}(${this.arg.alpha_repr(opts)})`
  }
}

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    return Value.Closure.apply(target.ret_cl, arg)
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.pi") {
      return Value.not_yet(
        Value.Closure.apply(target.t.ret_t_cl, arg),
        Neutral.ap(target.neutral, Normal.create(target.t.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Value.pi"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["Value.fn", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
