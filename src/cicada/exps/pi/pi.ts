import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import * as Ctx from "../../ctx"
import * as Value from "../../value"
import { pi_evaluable } from "./pi-evaluable"

export type Pi = Exp & {
  kind: "Pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export function Pi(name: string, arg_t: Exp, ret_t: Exp): Pi {
  return {
    kind: "Pi",
    name,
    arg_t,
    ret_t,
    ...pi_evaluable(name, arg_t, ret_t),
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, arg_t, Value.type)
        const arg_t_value = evaluate(Ctx.to_env(ctx), arg_t)
        check(Ctx.extend(ctx, name, arg_t_value), ret_t, Value.type)
        return Value.type
      },
    }),
    repr: () => `(${name}: ${arg_t.repr()}) -> ${ret_t.repr()}`,
    alpha_repr: (opts) => {
      const arg_t_repr = arg_t.alpha_repr(opts)
      const ret_t_repr = ret_t.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${arg_t_repr}) -> ${ret_t_repr}`
    },
  }
}
