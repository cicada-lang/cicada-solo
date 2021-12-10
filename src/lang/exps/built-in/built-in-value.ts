import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value, readback } from "../../value"

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

  abstract self_type(): Value

  abstract curry(arg_value_entry: Exps.ArgValueEntry): BuiltInValue

  get curried_length(): number {
    return this.curried_arg_value_entries.length
  }

  get curried_arg_t_values(): Array<Value> {
    throw new Error("TODO")
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    let core: Core = new Exps.BuiltInCore(this.name)

    for (const [
      index,
      arg_value_entry,
    ] of this.curried_arg_value_entries.entries()) {
      core = Exps.build_ap_from_arg_core_entry(core, {
        ...arg_value_entry,
        core: readback(
          ctx,
          this.curried_arg_t_values[index],
          arg_value_entry.value
        ),
      })
    }

    return core
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.BuiltInValue && this.name === that.name)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
  }
}
