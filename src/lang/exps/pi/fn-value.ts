import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
import { Value } from "../../value"
import { Closure } from "../closure"

export class FnValue extends Value {
  ret_cl: Closure

  constructor(ret_cl: Closure) {
    super()
    this.ret_cl = ret_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    // TODO
    // throw new Error("unify is not implemented for Exps.FnValue")
    return solution
  }
}
