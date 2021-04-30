import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Dot } from "../../cores"

export class DotNeutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Dot(this.target.readback_neutral(ctx), this.name)
  }
}
