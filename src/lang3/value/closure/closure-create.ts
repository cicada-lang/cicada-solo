import * as Closure from "../closure"
import * as Exp from "../../exp"
import * as Mod from "../../mod"
import * as Env from "../../env"

export function create(
  mod: Mod.Mod,
  env: Env.Env,
  name: string,
  ret: Exp.Exp
): Closure.Closure {
  return { mod, env, name, ret }
}
