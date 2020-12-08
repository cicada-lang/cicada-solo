import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_absurd_ind(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  absurd_ind: Exp.absurd_ind
): Value.Value {
  // NOTE the `motive` here is not a function from target_t to type,
  //   but a element of type.
  // NOTE We should always infer target,
  //   but we do a simple check for the simple absurd.
  Check.check(mod, ctx, absurd_ind.target, Value.absurd)
  Check.check(mod, ctx, absurd_ind.motive, Value.type)
  const motive = evaluator.evaluate(absurd_ind.motive, {
    mod,
    env: Ctx.to_env(ctx),
  })
  return motive
}
