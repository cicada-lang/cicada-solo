import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Var } from "../cores"

export class VarNeutral {
  name: string

  constructor(name: string) {
    this.name = name
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Var(this.name)
  }
}
