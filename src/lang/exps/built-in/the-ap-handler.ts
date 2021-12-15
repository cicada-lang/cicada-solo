import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TheApHandler extends ApHandler {
  target: Exps.TheValue

  constructor(target: Exps.TheValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    if (this.target.arg_value_entries.length < this.target.arity - 1) {
      return this.target.curry(arg_value_entry)
    } else {
      return arg_value_entry.value
    }
  }
}
