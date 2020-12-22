import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { ap_evaluable } from "./ap-evaluable"

export type Ap = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.ap"
    target: Exp
    arg: Exp
  }

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
    ...ap_evaluable(target, arg),
    ...Inferable({
      inferability: ({ ctx }) => {
        const target_t = infer(ctx, target)
        const pi = Value.is_pi(ctx, target_t)
        check(ctx, arg, pi.arg_t)
        const arg_value = evaluate(Ctx.to_env(ctx), arg)
        return Value.Closure.apply(pi.ret_t_cl, arg_value)
      },
    }),
    repr: () => `${target.repr()}(${arg.repr()})`,
    alpha_repr: (opts) => `${target.alpha_repr(opts)}(${arg.alpha_repr(opts)})`,
  }
}
