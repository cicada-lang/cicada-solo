import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { pi_evaluable } from "./pi-evaluable"

export type Pi = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.pi"
    name: string
    arg_t: Exp
    ret_t: Exp
  }

export function Pi(name: string, arg_t: Exp, ret_t: Exp): Pi {
  return {
    kind: "Exp.pi",
    name,
    arg_t,
    ret_t,
    ...pi_evaluable(name, arg_t, ret_t),
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
