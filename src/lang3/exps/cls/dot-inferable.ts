import { Inferable } from "../../inferable"
import { evaluator } from "../../evaluator"
import * as Infer from "../../infer"
import * as Check from "../../check"
import * as Evaluate from "../../evaluate"
import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Mod from "../../mod"
import * as Trace from "../../../trace"

export const dot_inferable = (target: Exp.Exp, name: string) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      const target_t = Infer.infer(mod, ctx, target)
      if (target_t.kind === "Value.cls") {
        return Evaluate.do_dot(target_t, name)
      }

      const target_value = evaluator.evaluate(target, {
        mod,
        env: Ctx.to_env(ctx),
      })

      if (target_value.kind === "Value.typecons") {
        const datacons = Evaluate.do_dot_typecons(target_value, name)
        return datacons.t
      }

      throw new Trace.Trace(
        "expecting target to be of type Value.cls, or to be a typecons."
      )
    },
  })
