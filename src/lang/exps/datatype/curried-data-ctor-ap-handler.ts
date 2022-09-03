import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class CurriedDataCtorApHandler extends ApHandler {
  target: Exps.CurriedDataCtorValue

  constructor(target: Exps.CurriedDataCtorValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    const { kind, value } = arg_value_entry

    if (this.target.arity === 0) {
      throw new Error(`I can not (${kind}) apply data constructor of arity 0.`)
    }

    const arg_value_entries = [
      ...this.target.arg_value_entries,
      { kind, value },
    ]

    if (this.target.arity === 1) {
      return new Exps.DataValue(this.target.data_ctor, arg_value_entries)
    } else {
      return new Exps.CurriedDataCtorValue(
        this.target.data_ctor,
        arg_value_entries,
      )
    }
  }
}
