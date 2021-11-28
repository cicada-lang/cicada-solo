import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class CurriedDataCtorApHandler extends ApHandler {
  target: Exps.CurriedDataCtorValue

  constructor(target: Exps.CurriedDataCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply data constructor of arity 0.")
    }

    const arg_value_entries: Array<Exps.ArgValueEntry> = [
      ...this.target.arg_value_entries,
      { kind: "plain", arg },
    ]

    if (this.target.arity === 1) {
      return new Exps.DataValue(
        this.target.type_ctor.name,
        this.target.name,
        arg_value_entries
      )
    }

    return new Exps.CurriedDataCtorValue(
      this.target.data_ctor,
      arg_value_entries
    )
  }

  implicit_apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not (implicit) apply data constructor of arity 0.")
    }

    const arg_value_entries: Array<Exps.ArgValueEntry> = [
      ...this.target.arg_value_entries,
      { kind: "implicit", arg },
    ]

    if (this.target.arity === 1) {
      return new Exps.DataValue(
        this.target.type_ctor.name,
        this.target.name,
        arg_value_entries
      )
    }

    return new Exps.CurriedDataCtorValue(
      this.target.data_ctor,
      arg_value_entries
    )
  }

  returned_apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not (returned) apply data constructor of arity 0.")
    }

    const arg_value_entries: Array<Exps.ArgValueEntry> = [
      ...this.target.arg_value_entries,
      { kind: "returned", arg },
    ]

    if (this.target.arity === 1) {
      return new Exps.DataValue(
        this.target.type_ctor.name,
        this.target.name,
        arg_value_entries
      )
    }

    return new Exps.CurriedDataCtorValue(
      this.target.data_ctor,
      arg_value_entries
    )
  }
}
