import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
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

  unify(subst: Subst, that: Value): Subst {
    throw new Error("unify is not implemented for Exps.FnValue")
  }
}
