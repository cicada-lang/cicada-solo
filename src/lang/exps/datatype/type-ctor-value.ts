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

// TODO `CtorBinding` should have `kind: "plain" | "implicit"`
export type CtorBinding = { name: string; arg_t: Core }

export class TypeCtorValue extends Value {
  name: string
  fixed: Record<string, Core>
  varied: Record<string, Core>
  ctors: Record<string, Core>
  env: Env

  constructor(
    name: string,
    fixed: Record<string, Core>,
    varied: Record<string, Core>,
    ctors: Record<string, Core>,
    env: Env
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.varied = varied
    this.ctors = ctors
    // NOTE The type constructor itself might be referenced in its `ctors`.
    this.env = env.extend(this.name, this)
  }

  ap_handler = new TypeCtorApHandler(this)
  dot_handler = new TypeCtorDotHandler(this)

  private apply_fixed(args: Array<Value>): Env {
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
    for (const [index, [name, arg_t_core]] of fixed_entries) {
      const arg_t = evaluate(env, arg_t_core)
      const arg = args[index]
      env = env.extend(name, arg)
    }

    return env
  }

  apply_ctor(
    ctor_name: string,
    opts: {
      fixed_args: Array<Value>
      args: (index: number, opts: { arg_t: Value; env: Env }) => Value
    }
  ): { env: Env; arg_t_values: Array<Value> } {
    const { fixed_args, args } = opts

    let env = this.apply_fixed(fixed_args)
    const arg_t_values: Array<Value> = []
    for (const [index, binding] of this.ctor_bindings(ctor_name).entries()) {
      // TODO handle implicit bindings
      const arg_t = evaluate(env, binding.arg_t)
      const arg = args(index, { arg_t, env })
      env = env.extend(binding.name, arg)
      arg_t_values.push(arg_t)
    }

    return { env, arg_t_values }
  }

  private ctor_bindings(name: string): Array<CtorBinding> {
    const bindings: Array<{ name: string; arg_t: Core }> = []
    let t = this.ctor_core(name)
    // TODO We should also handle `Exps.ImPiCore`.
    while (t instanceof Exps.PiCore) {
      const { name, arg_t, ret_t } = t
      bindings.push({ name, arg_t })
      t = ret_t
    }

    return bindings
  }

  ctor_arity(name: string): number {
    const bindings = this.ctor_bindings(name)
    return bindings.length
  }

  evaluate_ctor_ret_t(env: Env, name: string): Value {
    const ctor_ret_t_core = this.ctor_ret_t_core(name)
    return evaluate(env, ctor_ret_t_core)
  }

  private ctor_ret_t_core(name: string): Core {
    let t = this.ctor_core(name)
    // TODO We should also handle `Exps.ImPiCore`.
    while (t instanceof Exps.PiCore) {
      const { ret_t } = t
      t = ret_t
    }

    return t
  }

  private ctor_core(name: string): Core {
    const ctor = this.ctors[name]
    if (ctor === undefined) {
      const names = Object.keys(this.ctors).join(", ")
      throw new ExpTrace(
        [
          `I can not find the data constructor named: ${name}`,
          `  type constructor name: ${this.name}`,
          `  existing data constructor names: ${names}`,
        ].join("\n")
      )
    }

    return ctor
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
      const ctors = this.readback_ctors(
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

  private readback_varied(ctx: Ctx): Record<string, Core> {
    const varied: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_varied())) {
      varied[name] = readback(ctx, new Exps.TypeValue(), t)
      ctx = ctx.extend(name, t)
    }

    return varied
  }

  private readback_ctors(ctx: Ctx): Record<string, Core> {
    const ctors: Record<string, Core> = {}

    for (const [name, t] of Object.entries(this.value_of_ctors())) {
      ctors[name] = readback(ctx, new Exps.TypeValue(), t)
    }

    return ctors
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

  private value_of_ctors(): Record<string, Value> {
    const ctors: Record<string, Value> = {}
    const result = this.value_of_fixed()

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
    if (!conversion(ctx, t, this, that)) {
      return Solution.failure
    }

    return solution
  }
}
