import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

export class DataValue extends Value {
  data_ctor: Exps.DataCtorValue
  arg_value_entries: Array<Exps.ArgValueEntry>

  constructor(
    data_ctor: Exps.DataCtorValue,
    arg_value_entries: Array<Exps.ArgValueEntry>
  ) {
    super()
    this.data_ctor = data_ctor
    this.arg_value_entries = arg_value_entries
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeCtorValue && t.arity === 0) {
      t = t.as_datatype()
    }

    if (t instanceof Exps.DatatypeValue) {
      const result = this.data_ctor.apply({
        fixed_args: t.args,
        args: this.arg_value_entries.map((entry) => entry.value),
      })

      let result_core: Core = new Exps.DotCore(
        new Exps.VarCore(this.data_ctor.type_ctor.name),
        this.data_ctor.name
      )

      const arg_t_values = [
        ...result.fixed_arg_t_values,
        ...result.arg_t_value_entries.map(({ arg_t }) => arg_t),
      ]

      for (const [
        index,
        { kind, value: arg },
      ] of this.arg_value_entries.entries()) {
        result_core = Exps.build_ap_from_arg_core_entry(result_core, {
          kind,
          core: readback(ctx, arg_t_values[index], arg),
        })
      }

      return result_core
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (
      !(that instanceof Exps.DataValue) ||
      this.data_ctor.type_ctor.name !== that.data_ctor.type_ctor.name ||
      this.data_ctor.name !== that.data_ctor.name
    ) {
      return Solution.failure
    }

    const datatype = expect(ctx, t, Exps.DatatypeValue)

    const result = this.data_ctor.apply({
      fixed_args: datatype.args,
      args: this.arg_value_entries.map((entry) => entry.value),
    })

    for (const [index, entry] of result.arg_t_value_entries.entries()) {
      solution = solution.unify(
        ctx,
        entry.arg_t,
        this.arg_value_entries.map((entry) => entry.value)[index],
        that.arg_value_entries.map((entry) => entry.value)[index]
      )
    }

    return solution
  }
}
