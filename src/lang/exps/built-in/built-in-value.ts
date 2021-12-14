import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"

export abstract class BuiltInValue extends Value {
  name: string
  curried_arg_value_entries: Array<Exps.ArgValueEntry>

  constructor(
    name: string,
    curried_arg_value_entries: Array<Exps.ArgValueEntry>
  ) {
    super()
    this.name = name
    this.curried_arg_value_entries = curried_arg_value_entries
  }

  abstract arity: number

  abstract self_type(): Value

  curry?(arg_value_entry: Exps.ArgValueEntry): BuiltInValue

  // NOTE This is a value directed interface (v.s. type directed interface).
  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    // NOTE Nothing by default.
  }

  get curried_length(): number {
    return this.curried_arg_value_entries.length
  }

  get max_curried_length(): number {
    return this.arity - 1
  }

  private curried_arg_t_values(): Array<Value> {
    const curried_arg_t_values: Array<Value> = []
    let t = this.self_type()
    for (const arg_value_entry of this.curried_arg_value_entries) {
      if (
        !(
          t instanceof Exps.PiValue ||
          t instanceof Exps.ImplicitPiValue ||
          t instanceof Exps.VaguePiValue
        )
      ) {
        throw new ExpTrace(
          [
            `I expect t to be pi-like type`,
            `  class name: ${t.constructor.name}`,
          ].join("\n")
        )
      }

      curried_arg_t_values.push(t.arg_t)
      t = Exps.apply_arg_value_entry(t, arg_value_entry)
    }

    return curried_arg_t_values
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    const curried_arg_t_values = this.curried_arg_t_values()
    let core: Core = new Exps.BuiltInCore(this.name)
    for (const [
      index,
      arg_value_entry,
    ] of this.curried_arg_value_entries.entries()) {
      core = Exps.build_ap_from_arg_core_entry(core, {
        ...arg_value_entry,
        core: readback(ctx, curried_arg_t_values[index], arg_value_entry.value),
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
        this.curried_length === that.curried_length
      )
    ) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    const this_curried_arg_t_values = this.curried_arg_t_values()
    const that_curried_arg_t_values = that.curried_arg_t_values()

    for (const [
      index,
      this_curried_arg_value_entry,
    ] of this.curried_arg_value_entries.entries()) {
      const that_curried_arg_value_entry = that.curried_arg_value_entries[index]

      solution = solution.unify_type(
        ctx,
        this_curried_arg_t_values[index],
        that_curried_arg_t_values[index]
      )

      const curried_arg_t = this_curried_arg_t_values[index]

      solution = solution.unify(
        ctx,
        curried_arg_t,
        this_curried_arg_value_entry.value,
        that_curried_arg_value_entry.value
      )
    }

    return solution
  }
}
