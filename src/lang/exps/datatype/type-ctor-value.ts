import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as ut from "../../../ut"
import * as Exps from ".."

export class TypeCtorValue extends Value {
  name: string
  parameters: Record<string, Core>
  indexes: Record<string, Core>
  ctors: Record<string, Core>
  env: Env

  constructor(
    name: string,
    parameters: Record<string, Core>,
    indexes: Record<string, Core>,
    ctors: Record<string, Core>,
    env: Env
  ) {
    super()
    this.name = name
    this.parameters = parameters
    this.indexes = indexes
    this.ctors = ctors
    this.env = env
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // TODO compare `self_type`
    const parameters = this.readback_parameters(ctx)
    const indexes = this.readback_indexes(ctx)
    const ctors = this.readback_ctors(ctx)
    return new Exps.TypeCtorCore(this.name, parameters, indexes, ctors)
  }

  self_type(ctx: Ctx): Value {
    throw new Error("TODO")
  }

  readback_parameters(ctx: Ctx): Record<string, Core> {
    throw new Error("TODO")
  }

  readback_indexes(ctx: Ctx): Record<string, Core> {
    throw new Error("TODO")
  }

  readback_ctors(ctx: Ctx): Record<string, Core> {
    throw new Error("TODO")
  }

  unify(solution: Solution, that: Value): Solution {
    throw new Error("TODO")
  }
}
