import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

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

    const motive_t = this.motive_t(datatype)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)

    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    return {
      t: Exps.ApCore.multi_apply(motive_value, [
        ...datatype.varied_args,
        target_value,
      ]),
      core: new Exps.InductionCore(
        inferred_target.core,
        motive_core,
        this.check_cases(ctx, datatype)
      ),
    }
  }

  private check_cases(
    ctx: Ctx,
    datatype: Exps.DatatypeValue
  ): Array<Exps.CaseCoreEntry> {
    this.ensure_no_extra_cases(ctx, datatype)

    return Object.entries(datatype.type_ctor.data_ctors).map(
      ([name, data_ctor]) => {
        const case_entry = this.get_case_entry(name)
        return this.check_case(ctx, datatype, case_entry.exp, data_ctor)
      }
    )
  }

  private check_case(
    ctx: Ctx,
    datatype: Exps.DatatypeValue,
    exp: Exp,
    data_ctor: Exps.DataCtorValue
  ): Exps.CaseCoreEntry {
    throw new Error()
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

  private motive_t(datatype: Exps.DatatypeValue): Value {
    let env = datatype.type_ctor.env
    for (const [index, fixed_arg] of datatype.fixed_args.entries()) {
      const fixed_arg_name = datatype.type_ctor.fixed_arg_names[index]
      env = env.extend(fixed_arg_name, fixed_arg)
    }

    let datatype_core: Core = new Exps.VarCore(datatype.type_ctor.name)
    for (const arg_name of [...datatype.type_ctor.arg_names].reverse()) {
      datatype_core = new Exps.ApCore(datatype_core, new Exps.VarCore(arg_name))
    }

    let motive_core = new Exps.PiCore(
      "_target",
      datatype_core,
      new Exps.TypeCore()
    )
    const varied_entries = Object.entries(datatype.type_ctor.varied)
    for (const [varied_arg_name, varied_arg_t_core] of varied_entries) {
      motive_core = new Exps.PiCore(
        varied_arg_name,
        varied_arg_t_core,
        motive_core
      )
    }

    return evaluate(env, motive_core)
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
