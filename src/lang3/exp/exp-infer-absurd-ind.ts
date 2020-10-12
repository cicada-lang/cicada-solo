import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_absurd_ind(
  ctx: Ctx.Ctx,
  absurd_ind: Exp.absurd_ind
): Value.Value {
  // NOTE the `motive` here is not a function from target_t to type,
  //   but a element of type.
  // NOTE We should always infer target,
  //   but we do a simple check for the simple absurd.
  Exp.check(ctx, absurd_ind.target, Value.absurd)
  Exp.check(ctx, absurd_ind.motive, Value.type)
  const motive = Exp.evaluate(Ctx.to_env(ctx), absurd_ind.motive)
  return motive
}
