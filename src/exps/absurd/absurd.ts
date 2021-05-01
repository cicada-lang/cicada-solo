import { Env } from "../../env"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Absurd extends Exp {
  infer(ctx: Ctx): { t: Value; exp: Core } {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Absurd"
  }
}
