import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Sem from "../../sem"

export class DotNeutral extends Neutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    super()
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Sem.DotCore(this.target.readback_neutral(ctx), this.name)
  }
}
