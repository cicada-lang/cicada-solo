import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Sole extends Exp {
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
