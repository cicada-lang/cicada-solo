import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import pt from "@cicada-lang/partech"

export interface ExpMeta {
  span?: pt.Span
}

export abstract class Exp {
  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Exp
  abstract repr(): string

  meta?: ExpMeta

  check?(ctx: Ctx, t: Value): Core
  infer?(ctx: Ctx): { t: Value; core: Core }
}
