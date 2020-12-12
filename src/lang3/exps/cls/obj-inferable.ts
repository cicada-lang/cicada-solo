import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const obj_inferable = (properties: Map<string, Exp>) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      if (properties.size === 0) {
        return Value.cls(
          [],
          Value.Telescope.create(mod, Ctx.to_env(ctx), undefined, [])
        )
      }
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of object with properties.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    },
  })
