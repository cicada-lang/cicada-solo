import * as Exp from "../../exp"
import * as Mod from "../../mod"
import * as Env from "../../env"

export interface Closure {
  mod: Mod.Mod
  env: Env.Env
  name: string
  ret: Exp.Exp
}
