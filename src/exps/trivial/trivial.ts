import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Cores from "../../cores"

export class Trivial extends Exp {
  infer(ctx: Ctx): { t: Value; core: Core } {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Trivial"
  }
}
