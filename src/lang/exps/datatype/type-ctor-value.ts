import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
import { TypeCtorApHandler } from "./type-ctor-ap-handler"
import { TypeCtorDotHandler } from "./type-ctor-dot-handler"
import { DataCtorBinding } from "./data-ctor-value"

export class TypeCtorValue extends Value {
  name: string
  fixed: Record<string, Core>
  varied: Record<string, Core>
  ctors: Record<string, Core>
  data_ctors: Record<string, Exps.DataCtorValue>
  env: Env

  constructor(
    name: string,
    fixed: Record<string, Core>,
    varied: Record<string, Core>,
    data_ctors: Record<string, Core>,
    env: Env
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.varied = varied
    this.ctors = data_ctors
    // NOTE The type constructor itself might be referenced in its `ctors`.
    this.env = env.extend(this.name, this)

    this.data_ctors = {}
    for (const [name, ret_t] of Object.entries(data_ctors)) {
      this.data_ctors[name] = new Exps.DataCtorValue(this, name, ret_t)
    }
  }

  ap_handler = new TypeCtorApHandler(this)
  dot_handler = new TypeCtorDotHandler(this)

  get_data_ctor(name: string): Exps.DataCtorValue {
    const data_ctor = this.data_ctors[name]
    if (data_ctor === undefined) {
      const names = Object.keys(this.data_ctors).join(", ")
      throw new ExpTrace(
        [
          `I can not find the data constructor named: ${name}`,
          `  type constructor name: ${this.name}`,
          `  existing data constructor names: ${names}`,
        ].join("\n")
      )
    }

    return data_ctor
  }

  apply_fixed(args: Array<Value>): { env: Env; arg_t_values: Array<Value> } {
    const fixed_entries = Array.from(Object.entries(this.fixed).entries())

    if (args.length < fixed_entries.length) {
      throw new ExpTrace(
        [
          `I expect number of arguments to be not less than fixed entries`,
          `  args.length: ${args.length}`,
          `  fixed_entries.length: ${fixed_entries.length}`,
        ].join("\n")
      )
    }

    let env = this.env
    const arg_t_values: Array<Value> = []
    for (const [index, [name, arg_t_core]] of fixed_entries) {
      const arg_t = evaluate(env, arg_t_core)
      const arg = args[index]
      env = env.extend(name, arg)
      arg_t_values.push(arg_t)
    }

    return { env, arg_t_values }
  }

  get arity(): number {
    return Object.keys(this.fixed).length + Object.keys(this.varied).length
  }

  as_datatype(): Exps.DatatypeValue {
    if (this.arity !== 0) {
      throw new Error(`I expect the arity of type constructor to be zero.`)
    }

    return new Exps.DatatypeValue(this, [])
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    const self_type = this.self_type()

    if (conversion(ctx, new Exps.TypeValue(), t, self_type)) {
      const result = this.readback_fixed(ctx)
      const varied = this.readback_varied(result.ctx)
      // NOTE The `name` is already bound to this `TypeCtorValue` in `ctx`,
      //   we need to make it `NotYetValue` to avoid infinite recursion.
      const ctors = this.readback_data_ctors(
        result.ctx.define(
          this.name,
          self_type,
          new Exps.NotYetValue(self_type, new Exps.VarNeutral(this.name))
        )
      )
      return new Exps.TypeCtorCore(this.name, result.fixed, varied, ctors)
    }
  }

  self_type(): Value {
    // NOTE Since the `self_type` is `PiValue`,
    //   `PiValue.readback_eta_expansion` can handle it.
    return evaluate(
      this.env,
      Exps.TypeCtor.self_type_core(this.fixed, this.varied)
    )
  }

  private readback_fixed(ctx: Ctx): {
    fixed: Record<string, Core>
    ctx: Ctx
  } {
    const fixed: Record<string, Core> = {}
    const result = this.value_of_fixed()

    for (const [name, t] of Object.entries(result.fixed)) {
      fixed[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return { fixed, ctx }
  }

  private value_of_fixed(): {
    fixed: Record<string, Value>
    env: Env
  } {
    const fixed: Record<string, Value> = {}

    let env = this.env
    for (const [name, t_core] of Object.entries(this.fixed)) {
      const t = evaluate(env, t_core)
      fixed[name] = t
      env = env.extend(name, new Exps.NotYetValue(t, new Exps.VarNeutral(name)))
    }

    return { fixed, env }
  }

  private readback_varied(ctx: Ctx): Record<string, Core> {
    const varied: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_varied())) {
      varied[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return varied
  }

  private value_of_varied(): Record<string, Value> {
    const varied: Record<string, Value> = {}
    const result = this.value_of_fixed()

    let env = result.env
    for (const [name, t_core] of Object.entries(this.varied)) {
      const t = evaluate(env, t_core)
      varied[name] = t
      env = env.extend(name, new Exps.NotYetValue(t, new Exps.VarNeutral(name)))
    }

    return varied
  }

  private readback_data_ctors(ctx: Ctx): Record<string, Core> {
    const data_ctors: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_data_ctors())) {
      data_ctors[name] = readback(ctx, new Exps.TypeValue(), t)
    }

    return data_ctors
  }

  private value_of_data_ctors(): Record<string, Value> {
    const data_ctors: Record<string, Value> = {}
    const result = this.value_of_fixed()

    let env = result.env.extend(
      this.name,
      new Exps.NotYetValue(this.self_type(), new Exps.VarNeutral(this.name))
    )

    for (const [name, t_core] of Object.entries(this.ctors)) {
      const t = evaluate(env, t_core)
      data_ctors[name] = t
    }

    return data_ctors
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    // NOTE `TypeCtor` can only be defined at top-level,
    //   thus we use simple conversion check here.
    if (!conversion(ctx, t, this, that)) {
      return Solution.failure
    }

    return solution
  }
}
