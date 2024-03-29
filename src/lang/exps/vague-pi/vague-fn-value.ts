import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Closure } from "../closure"

export class VagueFnValue extends Value {
  ret_cl: Closure

  constructor(fn_cl: Closure) {
    super()
    this.ret_cl = fn_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
