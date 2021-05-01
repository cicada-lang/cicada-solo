import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Cores from "../cores"

export class VarNeutral {
  name: string

  constructor(name: string) {
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.Var(this.name)
  }
}
