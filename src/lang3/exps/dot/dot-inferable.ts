import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import * as Infer from "../../infer"

import * as Exp from "../../exp"
import * as Ctx from "../../ctx"
import * as Trace from "../../../trace"
import { do_dot, do_dot_typecons } from "./dot-evaluable"

export const dot_inferable = (target: Exp.Exp, name: string) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      const target_t = Infer.infer(mod, ctx, target)
      if (target_t.kind === "Value.cls") {
        return do_dot(target_t, name)
      }

      const target_value = evaluate(target, {
        mod,
        env: Ctx.to_env(ctx),
      })

      if (target_value.kind === "Value.typecons") {
        const datacons = do_dot_typecons(target_value, name)
        return datacons.t
      }

      throw new Trace.Trace(
        "expecting target to be of type Value.cls, or to be a typecons."
      )
    },
  })
