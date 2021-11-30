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

export class TypeCtorValue extends Value {
  name: string
  fixed: Record<string, Core>
  varied: Record<string, Core>
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

  get fixed_arity(): number {
    const fixed_arg_names = Object.keys(this.fixed)
    return fixed_arg_names.length
  }

  apply_fixed(opts: {
    fixed_args:
      | Array<Value>
      | ((index: number, opts: { arg_t: Value; env: Env }) => Value)
  }): {
    env: Env
    arg_t_values: Record<string, Value>
  } {
    const { fixed_args } = opts
    const fixed_entries = Array.from(Object.entries(this.fixed).entries())

    if (fixed_args.length < fixed_entries.length) {
      throw new ExpTrace(
        [
          `I expect number of arguments to be not less than fixed entries`,
          `  fixed_args.length: ${fixed_args.length}`,
          `  fixed_entries.length: ${fixed_entries.length}`,
        ].join("\n")
      )
    }

    let env = this.env
    const arg_t_values: Record<string, Value> = {}
    for (const [index, [name, arg_t_core]] of fixed_entries) {
      const arg_t = evaluate(env, arg_t_core)
      const arg =
        fixed_args instanceof Array
          ? fixed_args[index]
          : fixed_args(index, { arg_t, env })
      env = env.extend(name, arg)
      arg_t_values[name] = arg_t
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
    const result = this.apply_fixed_to_not_yet_values()

    for (const [name, t] of Object.entries(result.arg_t_values)) {
      fixed[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return { fixed, ctx }
  }

  apply_fixed_to_not_yet_values(): {
    arg_t_values: Record<string, Value>
    env: Env
  } {
    const fixed_arg_names = Object.keys(this.fixed)
    return this.apply_fixed({
      fixed_args: (index, { arg_t }) =>
        new Exps.NotYetValue(
          arg_t,
          new Exps.VarNeutral(fixed_arg_names[index])
        ),
    })
  }

  private readback_varied(ctx: Ctx): Record<string, Core> {
    const varied: Record<string, Core> = {}
    for (const [name, arg_t] of Object.entries(this.value_of_varied())) {
      varied[name] = readback(ctx, new Exps.TypeValue(), arg_t)
      ctx = ctx.extend(name, arg_t)
    }

    return varied
  }

  private value_of_varied(): Record<string, Value> {
    const varied: Record<string, Value> = {}
    const result = this.apply_fixed_to_not_yet_values()

    let env = result.env
    for (const [name, arg_t_core] of Object.entries(this.varied)) {
      const arg_t = evaluate(env, arg_t_core)
      const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(name))
      varied[name] = arg_t
      env = env.extend(name, arg)
    }

    return varied
  }

  private readback_data_ctors(ctx: Ctx): Record<string, Core> {
    const data_ctors: Record<string, Core> = {}
    for (const [name, data_ctor] of Object.entries(this.data_ctors)) {
      data_ctors[name] = data_ctor.readback_ret_t(ctx)
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
