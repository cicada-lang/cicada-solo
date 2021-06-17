import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import * as Exps from "../exps"

export abstract class Exp {
  instanceofExp = true

  abstract subst(name: string, exp: Exp): Exp
  abstract free_names(bound_names: Set<string>): Set<string>

  rename(name: string, new_name: string): Exp {
    return this.subst(name, new Exps.Var(new_name))
  }

  check?(ctx: Ctx, t: Value): Core
  infer?(ctx: Ctx): { t: Value; core: Core }
  abstract repr(): string
}
