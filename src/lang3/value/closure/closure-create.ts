import * as Closure from "../closure"
import * as Pattern from "../../pattern"
import * as Exp from "../../exp"
import * as Mod from "../../mod"
import * as Env from "../../env"

export function create(
  mod: Mod.Mod,
  env: Env.Env,
  pattern: Pattern.Pattern,
  ret: Exp.Exp
): Closure.Closure {
  return { mod, env, pattern, ret }
}
