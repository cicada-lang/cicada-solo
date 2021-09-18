import { Core } from "../core"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Value } from "../value"
import * as Exps from "../exps"

export class Type extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  substitute(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.TypeCore(),
    }
  }

  repr(): string {
    return "Type"
  }
}
