import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class DotNeutral extends Neutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    super()
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.DotCore(this.target.readback_neutral(ctx), this.name)
  }
}
