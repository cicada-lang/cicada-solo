import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import { Closure } from "../closure"

export class FnValue extends Value {
  ret_cl: Closure

  constructor(ret_cl: Closure) {
    super()
    this.ret_cl = ret_cl
  }

  apply(arg: Value): Value {
    return this.ret_cl.apply(arg)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
