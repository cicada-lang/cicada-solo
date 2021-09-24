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

  return Solution.empty
    .unifyOrFail(ctx, left, right)
    .findOrFail(ctx, not_yet_value)
}
