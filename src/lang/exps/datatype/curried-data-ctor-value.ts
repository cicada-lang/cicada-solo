import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
import { CurriedDataCtorApHandler } from "./curried-data-ctor-ap-handler"

export class CurriedDataCtorValue extends Value {
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

  get arity(): number {
    return this.data_ctor.arity - this.arg_value_entries.length
  }

  ap_handler = new CurriedDataCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeCtorValue && t.arity === 0) {
      t = t.as_datatype()
    }

    if (t instanceof Exps.DatatypeValue) {
      const result = this.data_ctor.apply({
        fixed_args: t.args,
        args: this.arg_value_entries.map(({ arg }) => arg),
        length: t.args.length + this.arg_value_entries.length,
      })

      let result_core: Core = new Exps.DotCore(
        new Exps.VarCore(this.data_ctor.type_ctor.name),
        this.data_ctor.name
      )

      const arg_t_values = [
        ...result.fixed_arg_t_values,
        ...result.arg_t_value_entries.map(({ arg_t }) => arg_t),
      ]

      for (const [index, { kind, arg }] of this.arg_value_entries.entries()) {
        result_core = Exps.wrap_arg_core_entry(result_core, {
          kind,
          arg: readback(ctx, arg_t_values[index], arg),
        })
      }

      return result_core
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
