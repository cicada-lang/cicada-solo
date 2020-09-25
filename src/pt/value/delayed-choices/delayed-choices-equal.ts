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
  // TODO
  return false
}
