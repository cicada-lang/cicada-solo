import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"

export class FixedFnValue extends Value {
  fn_cl: Closure

  constructor(fn_cl: Closure) {
    super()
    this.fn_cl = fn_cl
  }

  apply(arg: Value): Value {
    return this.fn_cl.apply(arg)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
