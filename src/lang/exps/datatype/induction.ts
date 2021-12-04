import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Induction extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  case_entries: Array<Exps.CaseEntry>

  constructor(
    target: Exp,
    motive: Exp,
    case_entries: Array<Exps.CaseEntry>,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.target = target
    this.motive = motive
    this.case_entries = case_entries
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.case_entries.flatMap((case_entry) =>
        Array.from(case_entry.exp.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Induction(
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      this.case_entries.map((case_entry) => ({
        ...case_entry,
        exp: subst(case_entry.exp, name, exp),
      })),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const datatype = expect(ctx, inferred_target.t, Exps.DatatypeValue)

    // datatype.type_ctor
    // datatype.args

    throw new Error("TODO")

    // const case_core_entries = "TODO"

    // return {
    //   t: "TODO",
    //   core: new Exps.InductionCore(
    //     inferred_target.core,
    //     motive_core,
    //     case_core_entries,
    //   ),
    // }
  }

  format(): string {
    const target = this.target.format()
    const motive = this.motive.format()
    const case_entries = this.case_entries
      .map((case_entry) =>
        case_entry.nullary
          ? `case ${case_entry.name} => ${case_entry.exp.format()}`
          : `case ${case_entry.name}${case_entry.exp.format()}`
      )
      .join(" ")

    return `induction (${target}) { ${motive} ${case_entries} }`
  }
}
