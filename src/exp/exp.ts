import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"

export abstract class Exp {
  instanceofExp = true

  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Exp
  abstract repr(): string

  check?(ctx: Ctx, t: Value): Core
  infer?(ctx: Ctx): { t: Value; core: Core }
}
