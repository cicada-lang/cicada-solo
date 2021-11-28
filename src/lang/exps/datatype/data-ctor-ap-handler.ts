import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class DataCtorApHandler extends ApHandler {
  target: Exps.DataCtorValue

  constructor(target: Exps.DataCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply data constructor of arity 0.")
    }

    const entry: Exps.ArgValueEntry = { kind: "plain", arg }

    if (this.target.arity === 1) {
      return new Exps.DataValue(this.target.type_ctor.name, this.target.name, [
        entry,
      ])
    }

    return new Exps.CurriedDataCtorValue(this.target, [entry])
  }

  implicit_apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not (implicit) apply data constructor of arity 0.")
    }

    const entry: Exps.ArgValueEntry = { kind: "implicit", arg }

    if (this.target.arity === 1) {
      return new Exps.DataValue(this.target.type_ctor.name, this.target.name, [
        entry,
      ])
    }

    return new Exps.CurriedDataCtorValue(this.target, [entry])
  }

  returned_apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not (returned) apply data constructor of arity 0.")
    }

    const entry: Exps.ArgValueEntry = { kind: "returned", arg }

    if (this.target.arity === 1) {
      return new Exps.DataValue(this.target.type_ctor.name, this.target.name, [
        entry,
      ])
    }

    return new Exps.CurriedDataCtorValue(this.target, [entry])
  }
}
