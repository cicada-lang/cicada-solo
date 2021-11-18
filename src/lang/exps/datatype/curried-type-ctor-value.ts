import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
import { CurriedTypeCtorApHandler } from "./curried-type-ctor-ap-handler"

export class CurriedTypeCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  arg: Value

  constructor(type_ctor: Exps.TypeCtorValue, arg: Value) {
    super()
    this.type_ctor = type_ctor
    this.arg = arg
  }

  ap_handler = new CurriedTypeCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
