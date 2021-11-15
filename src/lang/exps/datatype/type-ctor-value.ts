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
    if (conversion(ctx, new Exps.TypeValue(), t, this.self_type())) {
      const result = this.readback_parameters(ctx)
      const indexes = this.readback_indexes(result.ctx)
      // TODO extends `ctx` with `not-yet-value`,
      //   to support recursive definition while avoiding infinite loop.
      const ctors = this.readback_ctors(result.ctx)
      return new Exps.TypeCtorCore(this.name, result.parameters, indexes, ctors)
    }
  }

  private self_type(): Value {
    return evaluate(
      this.env,
      Exps.TypeCtor.self_type_core(this.parameters, this.indexes)
    )
  }

  readback_parameters(ctx: Ctx): {
    parameters: Record<string, Core>
    ctx: Ctx
  } {
    const parameters: Record<string, Core> = {}
    const result = this.value_of_parameters()

    for (const [name, t] of Object.entries(result.parameters)) {
      parameters[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return { parameters, ctx }
  }

  readback_indexes(ctx: Ctx): Record<string, Core> {
    const indexes: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_indexes())) {
      indexes[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return indexes
  }

  readback_ctors(ctx: Ctx): Record<string, Core> {
    throw new Error("TODO")
  }

  private value_of_parameters(): {
    parameters: Record<string, Value>
    env: Env
  } {
    const parameters: Record<string, Value> = {}

    let env = this.env
    for (const [name, t_core] of Object.entries(this.parameters)) {
      const t = evaluate(env, t_core)
      parameters[name] = t
      env = env.extend(name, new Exps.NotYetValue(t, new Exps.VarNeutral(name)))
    }

    return { parameters, env }
  }

  private value_of_indexes(): Record<string, Value> {
    const indexes: Record<string, Value> = {}
    const result = this.value_of_parameters()

    let env = result.env
    for (const [name, t_core] of Object.entries(this.indexes)) {
      const t = evaluate(env, t_core)
      indexes[name] = t
      env = env.extend(name, new Exps.NotYetValue(t, new Exps.VarNeutral(name)))
    }

    return indexes
  }

  private value_of_ctors(): Record<string, Value> {
    throw new Error("TODO")
  }

  unify(solution: Solution, that: Value): Solution {
    throw new Error("TODO")
  }
}
