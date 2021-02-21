import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Ctx from "../../ctx"
import * as Explain from "../../explain"
import * as Trace from "../../trace"

export type Var = Exp & {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
    evaluability: ({ env }) => {
      const result = env.lookup(name)
      if (result === undefined) {
        throw new Trace.Trace(Explain.explain_name_undefined(name))
      }
      return result
    },
    ...Inferable({
      inferability: ({ ctx }) => {
        const t = ctx.lookup(name)
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
