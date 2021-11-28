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
  ret_t: Core
  env: Env

  constructor(
    type_ctor: Exps.TypeCtorValue,
    name: string,
    ret_t: Core,
    env: Env
  ) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.ret_t = ret_t
    this.env = env
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.DotCore(new Exps.VarCore(this.type_ctor.name), this.name)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
