import * as DelayedChoices from "../delayed-choices"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Exp from "../../exp"
import * as Value from "../../value"

export function equal(
  x: DelayedChoices.DelayedChoices,
  y: DelayedChoices.DelayedChoices
): boolean {
  return (
    equal_choices(x.choices, y.choices) &&
    x.mod === y.mod &&
    Env.equal(x.env, y.env)
  )
}

function equal_choices(
  x: Map<string, Array<{ name?: string; value: Exp.Exp }>>,
  y: Map<string, Array<{ name?: string; value: Exp.Exp }>>
): boolean {
  if (x.size !== y.size) return false
  for (const [key, x_part] of x.entries()) {
    const y_part = y.get(key)
    if (y_part === undefined) return false
    if (!equal_parts(x_part, y_part)) return false
  }
  return true
}

function equal_parts(
  x: Array<{ name?: string; value: Exp.Exp }>,
  y: Array<{ name?: string; value: Exp.Exp }>
): boolean {
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (x[i].name !== y[i].name) return false
    if (!Exp.equal(x[i].value, y[i].value)) return false
  }
  return true
}
