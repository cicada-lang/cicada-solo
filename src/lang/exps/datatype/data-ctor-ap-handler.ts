import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class DataCtorApHandler extends ApHandler {
  target: Exps.DataCtorValue

  constructor(target: Exps.DataCtorValue) {
    super()
    this.target = target
  }

  private apply_by_kind(kind: Exps.ArgKind, arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error(`I can not (${kind}) apply data constructor of arity 0.`)
    }

    const arg_value_entries = [{ kind, arg }]

    if (this.target.arity === 1) {
      return new Exps.DataValue(
        this.target.type_ctor.name,
        this.target.name,
        arg_value_entries
      )
    }

    return new Exps.CurriedDataCtorValue(this.target, arg_value_entries)
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
