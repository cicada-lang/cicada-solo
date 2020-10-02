import * as DelayedChoices from "../delayed-choices"
import * as Env from "../../env"
import * as Exp from "../../exp"

export function equal(
  x: DelayedChoices.DelayedChoices,
  y: DelayedChoices.DelayedChoices
): boolean {
  if (x === y) return true
  return (
    Exp.equal_choices(x.choices, y.choices) &&
    x.mod === y.mod &&
    Env.equal(x.env, y.env)
  )
}
