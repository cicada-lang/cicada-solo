import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class PairApHandler extends ApHandler {
  target: Exps.PairValue

  constructor(target: Exps.PairValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    if (this.target.arg_value_entries.length < this.target.arity - 1) {
      return this.target.curry(arg_value_entry)
    } else {
      const env = Env.init()
        .extend("A", this.target.arg_value_entries[0].value)
        .extend("B", arg_value_entry.value)

      const t = new Exps.SigmaCore(
        "_",
        new Exps.VariableCore("A"),
        new Exps.VariableCore("B")
      )

      return evaluate(env, t)
    }
  }
}
