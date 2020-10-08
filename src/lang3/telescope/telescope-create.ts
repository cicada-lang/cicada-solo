import * as Telescope from "../telescope"
import * as Exp from "../exp"
import * as Value from "../value"

export function create(
  env: Map<string, Value.Value>,
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>,
  next: undefined | { name: string; t: Value.Value },
  scope: Array<{ name: string; t: Exp.Exp }>
): Telescope.Telescope {
  return {
    env,
    sat,
    next,
    scope,
  }
}
