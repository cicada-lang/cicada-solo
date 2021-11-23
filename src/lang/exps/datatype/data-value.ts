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
  args: Array<Value>

  constructor(type_ctor_name: string, name: string, args: Array<Value>) {
    super()
    this.type_ctor_name = type_ctor_name
    this.name = name
    this.args = args
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeCtorValue && t.arity === 0) {
      t = t.as_datatype()
    }

    if (t instanceof Exps.DatatypeValue) {
      const { arg_t_values } = t.type_ctor.apply_ctor(this.name, {
        fixed_args: t.args,
        args: (index) => this.args[index],
      })

      if (arg_t_values.length === this.args.length) {
        return new Exps.DataCore(
          this.type_ctor_name,
          this.name,
          this.args.map((arg, index) => readback(ctx, arg_t_values[index], arg))
        )
      }
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

    const { arg_t_values } = datatype.type_ctor.apply_ctor(this.name, {
      fixed_args: datatype.args,
      args: (index) => this.args[index],
    })

    if (
      arg_t_values.length !== this.args.length ||
      arg_t_values.length !== that.args.length
    ) {
      throw new ExpTrace(
        [
          `I expect the following lengths to be the same.`,
          `  arg_t_values.length: ${arg_t_values.length}`,
          `  this.args.length: ${this.args.length}`,
          `  that.args.length: ${that.args.length}`,
        ].join("\n")
      )
    }

    for (const [index, arg_t] of arg_t_values.entries()) {
      solution = solution.unify(ctx, arg_t, this.args[index], that.args[index])
    }

    return solution
  }
}
