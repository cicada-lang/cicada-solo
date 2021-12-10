import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TheApHandler extends ApHandler {
  target: Exps.TheValue

  constructor(target: Exps.TheValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.curried_length < this.target.max_curried_length) {
      return this.target.curry({ kind: "plain", value: arg })
    } else {
      const arg_value_entry = this.target.curried_arg_value_entries[1]
      return arg_value_entry.value
    }
  }
}
