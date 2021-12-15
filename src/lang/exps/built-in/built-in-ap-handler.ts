import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class BuiltInApHandler extends ApHandler {
  target: Exps.BuiltInValue
  finial_apply?: (arg_value_entries: Array<Exps.ArgValueEntry>) => Value

  constructor(
    target: Exps.BuiltInValue,
    opts?: {
      finial_apply?: (arg_value_entries: Array<Exps.ArgValueEntry>) => Value
    }
  ) {
    super()
    this.target = target
    this.finial_apply = opts?.finial_apply
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    if (this.target.arg_value_entries.length < this.target.arity - 1) {
      return this.target.curry(arg_value_entry)
    } else {
      if (this.finial_apply) {
        return this.finial_apply([
          ...this.target.arg_value_entries,
          arg_value_entry,
        ])
      } else {
        return this.target.curry(arg_value_entry)
      }
    }
  }
}
