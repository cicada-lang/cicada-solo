import { Core } from "../core"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import * as Cores from "../cores"

export class Type extends Exp {
  infer(ctx: Ctx): { t: Value; core: Core } {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Type"
  }
}
