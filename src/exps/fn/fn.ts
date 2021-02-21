import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Ctx from "../../ctx"
import { check } from "../../check"

export type Fn = Exp & {
  kind: "Fn"
  name: string
  ret: Exp
}

export function Fn(name: string, ret: Exp): Fn {
  return {
    kind: "Fn",
    name,
    ret,
    evaluability: ({ env }) => Value.fn(Value.Closure.create(env, name, ret)),
    checkability: (t, { ctx }) => {
      const pi = Value.is_pi(ctx, t)
      const arg = Value.not_yet(pi.arg_t, Neutral.v(name))
      const ret_t = Value.Closure.apply(pi.ret_t_cl, arg)
      check(ctx.extend(name, pi.arg_t), ret, ret_t)
    },
    repr: () => `(${name}) => ${ret.repr()}`,
    alpha_repr: (opts) => {
      const ret_repr = ret.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${name}) => ${ret_repr}`
    },
  }
}
