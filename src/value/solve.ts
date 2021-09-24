import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Solution } from "../solution"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function solve(
  not_yet_value: Exps.NotYetValue,
  opts: {
    ctx: Ctx
    left: Value
    right: Value
  }
): Value {
  const { ctx, left, right } = opts

  const solution = Solution.empty.unify(left, right)

  if (!(not_yet_value.neutral instanceof Exps.VarNeutral)) {
    throw new Trace(
      `Solve fail, expecting not_yet_value.neutral to be Exps.VarNeutral`
    )
  }

  if (Solution.failure_p(solution)) {
    const not_yet_value_repr = readback(
      ctx,
      not_yet_value.t,
      not_yet_value
    ).repr()
    const left_repr = readback(ctx, new Exps.TypeValue(), left).repr()
    const right_repr = readback(ctx, new Exps.TypeValue(), right).repr()
    throw new Trace(
      [
        `Unification fail, fail to solve logic variable: ${not_yet_value_repr}`,
        `  left: ${left_repr}`,
        `  right: ${right_repr}`,
      ].join("\n")
    )
  }

  const value = solution.find(Solution.logic_var_name(not_yet_value))

  if (value === undefined) {
    const not_yet_value_repr = readback(
      ctx,
      not_yet_value.t,
      not_yet_value
    ).repr()
    throw new Trace(`Fail to solve logic variable: ${not_yet_value_repr}`)
  }

  return value
}
