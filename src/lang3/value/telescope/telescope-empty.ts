import * as Telescope from "../telescope"
import * as Exp from "../../exp"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Value from "../../value"

export const empty: Telescope.Telescope = {
  mod: Mod.init(),
  env: Env.init(),
  next: undefined,
  scope: [],
}
