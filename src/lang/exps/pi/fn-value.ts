import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { FnApHandler } from "./fn-ap-handler"

export class FnValue extends Value {
  ret_cl: Closure

  constructor(ret_cl: Closure) {
    super()
    this.ret_cl = ret_cl
  }

  ap_handler = new FnApHandler(this)

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
