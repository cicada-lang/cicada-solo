import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Subst } from "../subst"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function solve(
  not_yet_value: Exps.NotYetValue,
  opts: {
    ctx: Ctx
    left: { t: Value; value: Value }
    right: { t: Value; value: Value }
  }
): { value: Value; core: Core } {
  const { ctx, left, right } = opts

  const subst = Subst.empty.unify(left.value, right.value)

  if (!(not_yet_value.neutral instanceof Exps.VarNeutral)) {
    throw new Trace(
      `Solve fail, expecting not_yet_value.neutral to be Exps.VarNeutral`
    )
  }

  if (Subst.failure_p(subst)) {
    const not_yet_value_repr = readback(
      ctx,
      not_yet_value.t,
      not_yet_value
    ).repr()
    const left_repr = readback(ctx, left.t, left.value).repr()
    const right_repr = readback(ctx, right.t, right.value).repr()
    throw new Trace(
      [
        `Unification fail, fail to solve logic variable: ${not_yet_value_repr}`,
        `  left: ${left_repr}`,
        `  right: ${right_repr}`,
      ].join("\n")
    )
  }

  const value = subst.find(Subst.logic_var_name(not_yet_value))
  if (value === undefined) {
    const not_yet_value_repr = readback(
      ctx,
      not_yet_value.t,
      not_yet_value
    ).repr()
    throw new Trace(`Fail to solve logic variable: ${not_yet_value_repr}`)
  }

  return {
    value,
    core: readback(ctx, not_yet_value.t, value),
  }
}
