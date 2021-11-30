import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class CurriedDataCtorApHandler extends ApHandler {
  target: Exps.CurriedDataCtorValue

  constructor(target: Exps.CurriedDataCtorValue) {
    super()
    this.target = target
  }

  private apply_by_kind(kind: Exps.ArgKind, arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error(`I can not (${kind}) apply data constructor of arity 0.`)
    }

    const arg_value_entries = [...this.target.arg_value_entries, { kind, arg }]

    if (this.target.arity === 1) {
      return new Exps.DataValue(
        this.target.data_ctor.type_ctor.name,
        this.target.data_ctor.name,
        arg_value_entries
      )
    }

    return new Exps.CurriedDataCtorValue(
      this.target.data_ctor,
      arg_value_entries
    )
  }

  apply(arg: Value): Value {
    return this.apply_by_kind("plain", arg)
  }

  implicit_apply(arg: Value): Value {
    return this.apply_by_kind("implicit", arg)
  }

  vague_apply(arg: Value): Value {
    return this.apply_by_kind("vague", arg)
  }
}
