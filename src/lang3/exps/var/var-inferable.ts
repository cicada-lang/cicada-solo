import { Inferable } from "../../inferable"
import * as Explain from "../../explain"
import * as Ctx from "../../ctx"
import * as Mod from "../../mod"
import * as Trace from "../../../trace"

export function var_inferable(name: string): Inferable {
  return Inferable({
    inferability: ({ mod, ctx }) => {
      const t = Ctx.lookup(ctx, name) || Mod.lookup_type(mod, name)
      if (t !== undefined) return t
      throw new Trace.Trace(Explain.explain_name_undefined(name))
    },
  })
}
