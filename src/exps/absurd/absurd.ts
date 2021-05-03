import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Absurd extends Exp {
  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = new Cores.TypeValue()
    const core = new Cores.Absurd()
    return { t, core }
  }

  repr(): string {
    return "Absurd"
  }
}
