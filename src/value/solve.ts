import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Subst } from "../subst"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function solve(
  ctx: Ctx,
  x_t: Value,
  x: Value,
  y_t: Value,
  y: Value,
  logic_var: Exps.NotYetValue
): { value: Value; core: Core } {
  const subst = Subst.empty.unify(x, y)

  if (!(logic_var.neutral instanceof Exps.VarNeutral)) {
    throw new Trace(
      `Solve fail, expecting logic_var.neutral to be Exps.VarNeutral`
    )
  }

  if (Subst.failure_p(subst)) {
    const logic_var_repr = readback(ctx, logic_var.t, logic_var).repr()
    const x_repr = readback(ctx, x_t, x).repr()
    const y_repr = readback(ctx, y_t, y).repr()
    throw new Trace(
      [
        `Unification fail, fail to solve logic variable: ${logic_var_repr}`,
        `  left: ${x_repr}`,
        `  right: ${y_repr}`,
      ].join("\n")
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
