import * as Exp from "../exp"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Value from "../value"

export interface Telescope {
  mod: Mod.Mod  
  env: Env.Env
  next: undefined | { name: string; t: Value.Value }
  scope: Array<{ name: string; t: Exp.Exp }>
}
