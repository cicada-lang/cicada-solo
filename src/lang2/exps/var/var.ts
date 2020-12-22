import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import * as Ctx from "../../ctx"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"
import { var_evaluable } from "./var-evaluable"

export type Var = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.v"
    name: string
  }

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    ...var_evaluable(name),
    ...Inferable({
      inferability: ({ ctx }) => {
        const t = Ctx.lookup(ctx, name)
        if (t === undefined) {
          throw new Trace.Trace(Explain.explain_name_undefined(name))
        }
        return t
      },
    }),
    repr: () => name,
    alpha_repr: (opts) => {
      const depth = opts.depths.get(name)
      if (depth === undefined) return name
      return `[${depth}]`
    },
  }
}
