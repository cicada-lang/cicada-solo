import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Str extends Exp {
  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = new Cores.TypeValue()
    const core = new Cores.Str()
    return { t, core }
  }

  repr(): string {
    return "String"
  }
}
