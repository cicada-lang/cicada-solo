import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export type CaseEntry = {
  nullary: boolean
  name: string
  exp: Exp
}

export class Induction extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  cases: Array<CaseEntry>

  constructor(
    target: Exp,
    motive: Exp,
    cases: Array<CaseEntry>,
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
      ...this.cases.flatMap(({ exp }) =>
        Array.from(exp.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Induction(
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      this.cases.map((entry) => ({ ...entry, exp: subst(exp, name, exp) })),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  format(): string {
    const target = this.target.format()
    const motive = this.motive.format()
    const cases = this.cases
      .map((entry) =>
        entry.nullary
          ? `case ${entry.name} => ${entry.exp.format()}`
          : `case ${entry.name}${entry.exp.format()}`
      )
      .join(" ")

    return `induction (${target}) { ${motive} ${cases} }`
  }
}
