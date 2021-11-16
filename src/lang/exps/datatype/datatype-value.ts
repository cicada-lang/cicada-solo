import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."

export class DatatypeValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, name: string, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.args = args
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
