import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class Trivial extends Exp {
  subst(name: string, exp: Exp): Exp {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.Trivial(),
    }
  }

  repr(): string {
    return "Trivial"
  }
}
