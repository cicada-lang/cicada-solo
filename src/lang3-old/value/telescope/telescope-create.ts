import * as Telescope from "../telescope"
import * as Exp from "../../exp"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Value from "../../value"

export function create(
  mod: Mod.Mod,
  env: Env.Env,
  next: undefined | { name: string; t: Value.Value },
  scope: Array<{ name: string; t: Exp.Exp }>
): Telescope.Telescope {
  return {
    mod,
    env,
    next,
    scope,
  }
}
