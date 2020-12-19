import { Inferable } from "../../inferable"
import * as Ctx from "../../ctx"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"

export const var_inferable = (name: string) =>
  Inferable({
    inferability: ({ ctx }) => {
      const t = Ctx.lookup(ctx, name)
      if (t === undefined) {
        throw new Trace.Trace(Explain.explain_name_undefined(name))
      }
      return t
    },
  })
