import { Core } from "../core"
import { Neutral } from "../neutral"
import { Ctx } from "../ctx"
import * as Exps from "../exps"

export class VarNeutral extends Neutral {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VarCore(this.name)
  }
}
