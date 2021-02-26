import { Neutral } from "../neutral"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Var } from "../core"

export class VarNeutral {
  kind: "Neutral.v" = "Neutral.v"

  name: string

  constructor(name: string) {
    this.name = name
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Var(this.name)
  }
}
