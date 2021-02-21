import { Exp } from "../exp"
import { Inferable } from "../inferable"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Ctx from "../ctx"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"

export type Ap = Exp & {
  kind: "Ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Ap",
    target,
    arg,
    evaluability: ({ env }) => do_ap(evaluate(env, target), evaluate(env, arg)),
    ...Inferable({
      inferability: ({ ctx }) => {
        const target_t = infer(ctx, target)
        const pi = Value.is_pi(ctx, target_t)
        check(ctx, arg, pi.arg_t)
        const arg_value = evaluate(ctx.to_env(), arg)
        return Value.Closure.apply(pi.ret_t_cl, arg_value)
      },
    }),
    repr: () => `${target.repr()}(${arg.repr()})`,
    alpha_repr: (opts) => `${target.alpha_repr(opts)}(${arg.alpha_repr(opts)})`,
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
