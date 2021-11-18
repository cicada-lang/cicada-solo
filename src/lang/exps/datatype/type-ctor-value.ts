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
import { TypeCtorApHandler } from "./type-ctor-ap-handler"

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

  get arity(): number {
    return (
      Object.keys(this.parameters).length + Object.keys(this.indexes).length
    )
  }

  get_arg_t(index: number): Value {
    const result = this.value_of_parameters()
    const array = [
      ...Object.values(result.parameters),
      ...Object.values(this.value_of_indexes()),
    ]

    const arg_t = array[index]
    if (arg_t === undefined) {
      throw new Error("index out of bound")
    }

    return arg_t
  }

  ap_handler = new TypeCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    const self_type = this.self_type()

    if (conversion(ctx, new Exps.TypeValue(), t, self_type)) {
      const result = this.readback_parameters(ctx)
      const indexes = this.readback_indexes(result.ctx)
      // NOTE The `name` is already bound to this `TypeCtorValue` in `ctx`,
      //   we need to make it `NotYetValue` to avoid infinite recursion.
      const ctors = this.readback_ctors(
        result.ctx.define(
          this.name,
          self_type,
          new Exps.NotYetValue(self_type, new Exps.VarNeutral(this.name))
        )
      )
      return new Exps.TypeCtorCore(this.name, result.parameters, indexes, ctors)
    }
  }

  self_type(): Value {
    // NOTE Since the `self_type` is `PiValue`,
    //   `PiValue.readback_eta_expansion` can handle it.
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
    const ctors: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_ctors())) {
      ctors[name] = readback(ctx, new Exps.TypeValue(), t)
    }

    return ctors
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
    const ctors: Record<string, Value> = {}
    const result = this.value_of_parameters()

    let env = result.env.extend(
      this.name,
      new Exps.NotYetValue(this.self_type(), new Exps.VarNeutral(this.name))
    )

    for (const [name, t_core] of Object.entries(this.ctors)) {
      const t = evaluate(env, t_core)
      ctors[name] = t
    }

    return ctors
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    // NOTE `TypeCtor` can only be defined at top-level,
    //   thus we use simple conversion check here.
    if (conversion(ctx, t, this, that)) {
      return solution
    } else {
      return Solution.failure
    }
  }
}
