import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { expect, Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

export class DataValue extends Value {
  type_ctor_name: string
  name: string
  arg_value_entries: Array<Exps.ArgValueEntry>

  constructor(
    type_ctor_name: string,
    name: string,
    arg_value_entries: Array<Exps.ArgValueEntry>
  ) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.arg_value_entries = arg_value_entries
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeCtorValue && t.arity === 0) {
      t = t.as_datatype()
    }

    if (t instanceof Exps.DatatypeValue) {
      const data_ctor = t.type_ctor.get_data_ctor(this.name)
      const result = data_ctor.apply({
        fixed_args: t.args,
        args: this.arg_value_entries.map(({ arg }) => arg),
      })

      let result_core: Core = new Exps.DotCore(
        new Exps.VarCore(this.type_ctor_name),
        this.name
      )

      const arg_t_values = [
        ...result.fixed_arg_t_values,
        ...result.arg_t_values,
      ]

      for (const [index, { kind, arg }] of this.arg_value_entries.entries()) {
        const arg_core = readback(ctx, arg_t_values[index], arg)
        switch (kind) {
          case "plain":
            result_core = new Exps.ApCore(result_core, arg_core)
            break
          case "implicit":
            result_core = new Exps.ImplicitApCore(result_core, arg_core)
            break
          case "vague":
            result_core = new Exps.VagueApCore(result_core, arg_core)
            break
        }
      }

      return result_core
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (
      !(that instanceof Exps.DataValue) ||
      !(this.type_ctor_name === that.type_ctor_name) ||
      !(this.name === that.name)
    ) {
      return Solution.failure
    }

    const datatype = expect(ctx, t, Exps.DatatypeValue)

    const data_ctor = datatype.type_ctor.get_data_ctor(this.name)
    const { arg_t_values } = data_ctor.apply({
      fixed_args: datatype.args,
      args: this.arg_value_entries.map(({ arg }) => arg),
    })

    if (
      arg_t_values.length !== this.arg_value_entries.length ||
      arg_t_values.length !== that.arg_value_entries.length
    ) {
      throw new ExpTrace(
        [
          `I expect the following lengths to be the same.`,
          `  arg_t_values.length: ${arg_t_values.length}`,
          `  this.arg_value_entries.length: ${this.arg_value_entries.length}`,
          `  that.arg_value_entries.length: ${that.arg_value_entries.length}`,
        ].join("\n")
      )
    }

    for (const [index, arg_t] of arg_t_values.entries()) {
      solution = solution.unify(
        ctx,
        arg_t,
        this.arg_value_entries.map(({ arg }) => arg)[index],
        that.arg_value_entries.map(({ arg }) => arg)[index]
      )
    }

    return solution
  }
}
