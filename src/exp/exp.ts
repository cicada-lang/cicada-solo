import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import { Narrator } from "../narrator"
import pt from "@cicada-lang/partech"

export interface ExpMeta {
  span?: pt.Span
}

export interface ElaborationOptions {
  narrator?: Narrator
}

export abstract class Exp {
  meta?: ExpMeta

  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Exp
  abstract repr(): string

  check?(ctx: Ctx, t: Value, opts?: ElaborationOptions): Core
  infer?(ctx: Ctx, opts?: ElaborationOptions): { t: Value; core: Core }
}
