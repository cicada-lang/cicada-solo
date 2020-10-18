import * as Exp from "../../exp"
import * as Pattern from "../../pattern"
import * as Mod from "../../mod"
import * as Env from "../../env"

export interface Closure {
  mod: Mod.Mod
  env: Env.Env
  pattern: Pattern.Pattern
  ret: Exp.Exp
}
