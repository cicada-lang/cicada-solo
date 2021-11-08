import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as ut from "../../../ut"
import * as Exps from "../../exps"

export class DatatypeValue extends Value {
  // path
  // name
  // parameters
  // indexes
  // ctors

  constructor() {
    super()
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, that: Value): Solution {
    throw new Error("TODO")
  }
}
