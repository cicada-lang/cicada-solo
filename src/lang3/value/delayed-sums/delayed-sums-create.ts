import * as DelayedSums from "../delayed-sums"
import * as Exp from "../../exp"
import * as Mod from "../../mod"
import * as Env from "../../env"

export function create(
  sums: Array<{ tag: string; t: Exp.Exp }>,
  mod: Mod.Mod,
  env: Env.Env
): DelayedSums.DelayedSums {
  return {
    sums,
    mod,
    env,
  }
}
