import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Induction extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  cases: Record<string, Exp>

  constructor(
    target: Exp,
    motive: Exp,
    cases: Record<string, Exp>,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.target = target
    this.motive = motive
    this.cases = cases
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...Object.values(this.cases).flatMap((c) =>
        Array.from(c.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    throw new Error("TODO")
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  format(): string {
    throw new Error("TODO")
  }
}
