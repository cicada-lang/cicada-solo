import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class Dot2Neutral extends Neutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    super()
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.Dot2(this.target.readback_neutral(ctx), this.name)
  }
}
