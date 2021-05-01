import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Str extends Exp {
  infer(ctx: Ctx): { t: Value; exp: Core } {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "String"
  }
}
