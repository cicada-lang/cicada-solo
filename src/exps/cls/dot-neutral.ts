import { Neutral } from "../../neutral"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Dot } from "../../exps"

export class DotNeutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Dot(this.target.readback_neutral(ctx), this.name)
  }
}
