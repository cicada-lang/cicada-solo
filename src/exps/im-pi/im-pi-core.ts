import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from ".."

export abstract class ImPiCore extends Core {
  instanceofImPiCore = true

  abstract im_pi_args_repr(): Array<string>
  abstract pi_args_repr(): Array<string>
  abstract pi_ret_t_repr(): string
}
