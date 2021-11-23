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
    t = t instanceof Exps.TypeCtorValue ? new Exps.DatatypeValue(t, []) : t

    if (t instanceof Exps.DatatypeValue && t.args.length === this.args.length) {
      const args = []
      for (const [index, arg] of this.args.entries()) {
        args.push(readback(ctx, t.args[index], arg))
      }

      return new Exps.DataCore(this.type_ctor_name, this.name, args)
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

    if (
      datatype.args.length !== this.args.length ||
      datatype.args.length !== that.args.length
    ) {
      throw new ExpTrace(
        [
          `I expect the following lengths to be the same.`,
          `  datatype.args.length: ${datatype.args.length}`,
          `  this.args.length: ${this.args.length}`,
          `  that.args.length: ${that.args.length}`,
        ].join("\n")
      )
    }

    for (const [index, arg_t] of datatype.args.entries()) {
      solution = solution.unify(ctx, arg_t, this.args[index], that.args[index])
    }

    return solution
  }
}
