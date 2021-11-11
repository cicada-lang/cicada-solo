import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as ut from "../../../ut"
import * as Exps from "../../exps"

export class DatatypeValue extends Value {
  name: string
  parameters: Array<{ name: string; t: Core }>
  indexes: Array<{ name: string; t: Core }>
  ctors: Array<{ name: string; t: Value }>

  constructor(
    name: string,
    parameters: Array<{ name: string; t: Core }>,
    indexes: Array<{ name: string; t: Core }>,
    ctors: Array<{ name: string; t: Value }>
  ) {
    super()
    this.name = name
    this.parameters = parameters
    this.indexes = indexes
    this.ctors = ctors
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, that: Value): Solution {
    throw new Error("TODO")
  }
}
