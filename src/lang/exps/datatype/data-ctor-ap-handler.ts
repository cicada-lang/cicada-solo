import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class DataCtorApHandler extends ApHandler {
  target: Exps.DataCtorValue

  constructor(target: Exps.DataCtorValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    const { kind, value } = arg_value_entry

    if (this.target.arity === 0) {
      throw new Error(`I can not (${kind}) apply data constructor of arity 0.`)
    }

    const arg_value_entries = [{ kind, value }]

    if (this.target.arity === 1) {
      return new Exps.DataValue(this.target, arg_value_entries)
    } else {
      return new Exps.CurriedDataCtorValue(this.target, arg_value_entries)
    }
  }
}
