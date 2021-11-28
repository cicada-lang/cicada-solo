import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
import { CurriedDataCtorApHandler } from "./curried-data-ctor-ap-handler"

export class CurriedDataCtorValue extends Value {
  data_ctor: Exps.DataCtorValue
  arg_value_entries: Array<Exps.ArgValueEntry>

  constructor(
    data_ctor: Exps.DataCtorValue,
    arg_value_entries: Array<Exps.ArgValueEntry>
  ) {
    super()
    this.data_ctor = data_ctor
    this.arg_value_entries = arg_value_entries
  }

  get type_ctor(): Exps.TypeCtorValue {
    return this.data_ctor.type_ctor
  }

  get name(): string {
    return this.data_ctor.name
  }

  get arity(): number {
    return this.data_ctor.arity - this.arg_value_entries.length
  }

  ap_handler = new CurriedDataCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
