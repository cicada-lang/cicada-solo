import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, readback, Value } from "../../value"

export class Recursion extends Exp {
  meta: ExpMeta
  target: Exp
  case_entries: Array<Exps.CaseEntry>

  constructor(target: Exp, case_entries: Array<Exps.CaseEntry>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.case_entries = case_entries
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.case_entries.flatMap((case_entry) =>
        Array.from(case_entry.exp.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Recursion(
      subst(this.target, name, exp),
      this.case_entries.map((case_entry) => ({
        ...case_entry,
        exp: subst(case_entry.exp, name, exp),
      })),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred_target = infer(ctx, this.target)

    let inferred_target_t = inferred_target.t

    if (
      inferred_target_t instanceof Exps.TypeCtorValue &&
      inferred_target_t.arity === 0
    ) {
      inferred_target_t = inferred_target_t.as_datatype()
    }

    const datatype = expect(ctx, inferred_target_t, Exps.DatatypeValue)

    const motive_t = datatype.build_motive_t()

    let motive_core = readback(ctx, new Exps.TypeValue(), t)
    // TODO The name "_" might free occur in `motive_core`.
    for (const name of Object.keys(Object.keys(datatype.type_ctor.varied))) {
      motive_core = new Exps.FnCore("_", motive_core)
    }
    motive_core = new Exps.FnCore("_", motive_core)

    const motive_value = evaluate(ctx.to_env(), motive_core)

    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    this.ensure_no_extra_cases(ctx, datatype)

    const case_core_entries = Object.keys(datatype.type_ctor.data_ctors).map(
      (name) => {
        const case_entry = this.get_case_entry(name)
        const case_t = datatype.build_case_t(name, motive_value)
        const core = check(ctx, case_entry.exp, case_t)
        // { // DEBUG
        //   console.log({
        //     msg: "[Induction.infer] checking case core entry",
        //     name,
        //     exp: case_entry.exp.format(),
        //     core: core.format(),
        //   })
        // }
        return { ...case_entry, core }
      }
    )

    return new Exps.InductionCore(
      inferred_target.core,
      motive_core,
      case_core_entries
    )
  }

  private get_case_entry(name: string): Exps.CaseEntry {
    const found = this.case_entries.find(
      (case_entry) => case_entry.name === name
    )

    if (found === undefined) {
      const case_names = this.case_entries.map((case_entry) => case_entry.name)
      throw new ExpTrace(
        [
          `I can not find case of given data constructor name.`,
          `  data constructor name: ${name}`,
          `  case names: ${case_names.join(", ")}`,
        ].join("\n")
      )
    }

    return found
  }

  private ensure_no_extra_cases(ctx: Ctx, datatype: Exps.DatatypeValue): void {
    for (const case_entry of this.case_entries) {
      const data_ctor = datatype.type_ctor.data_ctors[case_entry.name]
      if (data_ctor === undefined) {
        const data_ctor_names = Object.keys(datatype.type_ctor.data_ctors)
        throw new ExpTrace(
          [
            `I can not find data constructor from given case name.`,
            `  case name: ${case_entry.name}`,
            `  data constructor names: ${data_ctor_names.join(", ")}`,
          ].join("\n")
        )
      }
    }
  }

  format(): string {
    const target = this.target.format()
    const case_entries = this.case_entries
      .map((case_entry) =>
        case_entry.nullary
          ? `case ${case_entry.name} => ${case_entry.exp.format()}`
          : `case ${case_entry.name}${case_entry.exp.format()}`
      )
      .join(" ")

    return `recursion (${target}) { ${case_entries} }`
  }
}
