import { Core } from "../core"
import { Neutral } from "../neutral"
import { Ctx } from "../ctx"
import * as Cores from "../cores"

export class VarNeutral extends Neutral {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.Var(this.name)
  }
}
