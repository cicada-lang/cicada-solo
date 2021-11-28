import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."

export class DataCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string

  constructor(type_ctor: Exps.TypeCtorValue, name: string) {
    super()
    this.type_ctor = type_ctor
    this.name = name
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }
}
