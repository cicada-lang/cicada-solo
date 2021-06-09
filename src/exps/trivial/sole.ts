import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Sole extends Exp {
  subst(name: string, exp: Exp): Exp {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TrivialValue(),
      core: new Cores.Sole(),
    }
  }

  repr(): string {
    return "sole"
  }
}
