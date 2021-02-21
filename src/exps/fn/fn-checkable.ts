import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Ctx from "../../ctx"
import { Checkable } from "../../checkable"
import { check } from "../../check"

export const fn_checkable = (name: string, ret: Exp) =>
  Checkable({
    checkability: (t, { ctx }) => {
      const pi = Value.is_pi(ctx, t)
      const arg = Value.not_yet(pi.arg_t, Neutral.v(name))
      const ret_t = Value.Closure.apply(pi.ret_t_cl, arg)
      check(ctx.extend(name, pi.arg_t), ret, ret_t)
    },
  })
