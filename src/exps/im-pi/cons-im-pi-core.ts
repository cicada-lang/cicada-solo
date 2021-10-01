import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class ConsImPiCore extends Exps.ImPiCore {
  field_name: string
  local_name: string
  arg_t: Core
  ret_t: Exps.ImPiCore

  constructor(
    field_name: string,
    local_name: string,
    arg_t: Core,
    ret_t: Exps.ImPiCore
  ) {
    super(field_name, local_name, arg_t, ret_t)
    this.field_name = field_name
    this.local_name = local_name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }
}
