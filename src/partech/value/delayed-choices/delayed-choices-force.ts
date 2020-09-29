import * as DelayedChoices from "../delayed-choices"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Exp from "../../exp"
import * as Value from "../../value"

export function force(
  delayed: DelayedChoices.DelayedChoices
): Map<string, Array<{ name?: string; value: Value.Value }>> {
  const { choices, mod, env } = delayed
  if (delayed.cache) return delayed.cache
  delayed.cache = new Map(
    Array.from(choices, ([name, parts]) => [
      name,
      parts.flatMap((part) => evaluate_part(mod, env, part)),
    ])
  )
  return delayed.cache
}

function evaluate_part(
  mod: Mod.Mod,
  env: Env.Env,
  part: { name?: string; value: Exp.Exp }
): Array<{ name?: string; value: Value.Value }> {
  function create_part(
    value: Value.Value
  ): { name?: string; value: Value.Value } {
    return part.name && pickup_p(value) ? { value, name: part.name } : { value }
  }

  return Exp.evaluate(mod, env, part.value).map(create_part)
}

function pickup_p(value: Value.Value): boolean {
  return value.kind === "Value.grammar" || value.kind === "Value.pattern"
}
