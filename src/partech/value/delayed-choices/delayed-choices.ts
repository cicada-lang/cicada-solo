import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Exp from "../../exp"
import * as Value from "../../value"

export type DelayedChoices = {
  choices: Map<string, Array<{ name?: string; value: Exp.Exp }>>
  cache?: Map<string, Array<{ name?: string; value: Value.Value }>>
  mod: Mod.Mod
  env: Env.Env
}
