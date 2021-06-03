import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class VectorHeadNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.VectorHead(this.target.readback_neutral(ctx))
  }
}
