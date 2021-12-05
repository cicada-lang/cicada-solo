import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class InductionCore extends Core {
  target: Core
  motive: Core
  case_entries: Array<Exps.CaseCoreEntry>

  constructor(
    target: Core,
    motive: Core,
    case_entries: Array<Exps.CaseCoreEntry>
  ) {
    super()
    this.target = target
    this.motive = motive
    this.case_entries = case_entries
  }

  evaluate(env: Env): Value {
    return InductionCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      this.case_entries.map((case_entry) => ({
        ...case_entry,
        value: evaluate(env, case_entry.core),
      }))
    )
  }

  format(): string {
    const target = this.target.format()
    const motive = this.motive.format()
    const case_entries = this.case_entries
      .map((case_entry) =>
        case_entry.nullary
          ? `case ${case_entry.name} => ${case_entry.core.format()}`
          : `case ${case_entry.name}${case_entry.core.format()}`
      )
      .join(" ")

    return `induction (${target}) { ${motive} ${case_entries} }`
  }

  alpha_format(ctx: AlphaCtx): string {
    const target = this.target.alpha_format(ctx)
    const motive = this.motive.alpha_format(ctx)
    const case_entries = this.case_entries
      .map((case_entry) =>
        case_entry.nullary
          ? `case ${case_entry.name} => ${case_entry.core.alpha_format(ctx)}`
          : `case ${case_entry.name}${case_entry.core.alpha_format(ctx)}`
      )
      .join(" ")

    return `induction (${target}) { ${motive} ${case_entries} }`
  }

  static apply(
    target: Value,
    motive: Value,
    case_entries: Array<Exps.CaseValueEntry>
  ): Value {
    if (target instanceof Exps.DataValue) {
      const case_entry = case_entries.find(
        (case_entry) => case_entry.name === target.data_ctor.name
      )

      if (case_entry === undefined) {
        const case_entries_names = case_entries.map(
          (case_entry) => case_entry.name
        )
        throw new InternalError(
          [
            `I can not find case entry from target data constructor name.`,
            `  target data constructor name: ${target.data_ctor.name}`,
            `  case entries names: ${case_entries_names.join(", ")}`,
          ].join("\n")
        )
      }

      // TODO apply function of case entry to arguments
      case_entry
      target.data_ctor
      target.arg_value_entries
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.DataValue],
      })
    }

    if (!(target.t instanceof Exps.DatatypeValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.DatatypeValue],
      })
    }

    throw new Error("TODO")
  }
}
