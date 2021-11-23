import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { expect, Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class DataValue extends Value {
  type_ctor_name: string
  name: string
  args: Array<Value>

  constructor(type_ctor_name: string, name: string, args: Array<Value>) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.args = args
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    throw new Error("TODO")
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
