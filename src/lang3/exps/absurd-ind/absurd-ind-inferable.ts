import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluable"
// import { evaluate } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Check from "../../check"

export const absurd_ind_inferable = (target: Exp, motive: Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      // NOTE the `motive` here is not a function from target_t to type,
      //   but a element of type.
      // NOTE We should always infer target,
      //   but we do a simple check for the simple absurd.
      Check.check(mod, ctx, target, Value.absurd)
      Check.check(mod, ctx, motive, Value.type)
      return evaluate(motive, {
        mod,
        env: Ctx.to_env(ctx),
      })
    },
  })
