import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Closure } from "../../closure"

export class FnValue {
  ret_cl: Closure

  constructor(ret_cl: Closure) {
    this.ret_cl = ret_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
