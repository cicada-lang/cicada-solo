import { Ctx } from "../ctx"
import { Value, Subst, readback } from "../value"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function solve(
  ctx: Ctx,
  x: Value,
  y: Value,
  logic_var: Exps.NotYetValue
): { value: Value; core: Core } {
  const subst = Subst.null.unify(x, y)

  if (!(logic_var.neutral instanceof Exps.VarNeutral)) {
    throw new Trace(
      `Solve fail, expecting logic_var.neutral to be Exps.VarNeutral`
    )
  }

  if (subst.null_p) {
    const logic_var_repr = readback(ctx, logic_var.t, logic_var).repr()
    throw new Trace(
      `Unification fail, fail to solve logic variable: ${logic_var_repr}`
    )
  }

  const value = subst.find(Subst.logic_var_name(logic_var))
  if (value === undefined) {
    const logic_var_repr = readback(ctx, logic_var.t, logic_var).repr()
    throw new Trace(`Fail to solve logic variable: ${logic_var_repr}`)
  }

  return {
    value,
    core: readback(ctx, logic_var.t, value),
  }
}
