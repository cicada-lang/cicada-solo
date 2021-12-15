import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"
import { BuiltInApHandler } from "./built-in-ap-handler"

export abstract class BuiltInValue extends Value {
  name: string
  arg_value_entries: Array<Exps.ArgValueEntry>

  constructor(
    name: string,
    curried_arg_value_entries: Array<Exps.ArgValueEntry>
  ) {
    super()
    this.name = name
    this.arg_value_entries = curried_arg_value_entries
  }

  abstract arity: number

  abstract curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue

  ap_handler = new BuiltInApHandler(this)

  abstract self_type(): Value

  // NOTE This is a value directed interface (v.s. type directed interface).
  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    // NOTE Nothing by default.
  }

  private is_pi_like_value(
    value: Value
  ): value is Exps.PiValue | Exps.ImplicitPiValue | Exps.VaguePiValue {
    return (
      value instanceof Exps.PiValue ||
      value instanceof Exps.ImplicitPiValue ||
      value instanceof Exps.VaguePiValue
    )
  }

  private arg_t_values(): Array<Value> {
    const arg_t_values: Array<Value> = []
    let t = this.self_type()
    for (const arg_value_entry of this.arg_value_entries) {
      if (!this.is_pi_like_value(t)) {
        throw new ExpTrace(
          [
            `I expect t to be pi-like type`,
            `  class name: ${t.constructor.name}`,
          ].join("\n")
        )
      }

      arg_t_values.push(t.arg_t)
      t = t.ret_t_cl.apply(arg_value_entry.value)
    }

    return arg_t_values
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    const arg_t_values = this.arg_t_values()
    let core: Core = new Exps.BuiltInCore(this.name)
    for (const [index, arg_value_entry] of this.arg_value_entries.entries()) {
      core = Exps.build_ap_from_arg_core_entry(core, {
        ...arg_value_entry,
        core: readback(ctx, arg_t_values[index], arg_value_entry.value),
      })
    }

    return core
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (
      !(
        that instanceof Exps.BuiltInValue &&
        this.name === that.name &&
        this.arity === that.arity &&
        this.arg_value_entries.length === that.arg_value_entries.length
      )
    ) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    const this_arg_t_values = this.arg_t_values()
    const that_arg_t_values = that.arg_t_values()

    for (const [
      index,
      this_arg_value_entry,
    ] of this.arg_value_entries.entries()) {
      const that_arg_value_entry = that.arg_value_entries[index]

      solution = solution.unify_type(
        ctx,
        this_arg_t_values[index],
        that_arg_t_values[index]
      )

      solution = solution.unify(
        ctx,
        this_arg_t_values[index],
        this_arg_value_entry.value,
        that_arg_value_entry.value
      )
    }

    return solution
  }
}
