import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { fn_evaluable } from "./fn-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Fn = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.fn"
    name: string
    ret: Exp
  }

export function Fn(name: string, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    name,
    ret,
    ...fn_evaluable(name, ret),
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
