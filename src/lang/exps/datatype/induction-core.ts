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
    if (target instanceof Exps.DataCtorValue && target.arity === 0) {
      target = target.as_data()
    }

    if (target instanceof Exps.DataValue) {
      const data_ctor = target.data_ctor
      const case_entry = case_entries.find(
        (case_entry) => case_entry.name === data_ctor.name
      )

      if (case_entry === undefined) {
        const case_entries_names = case_entries.map(
          (case_entry) => case_entry.name
        )
        throw new InternalError(
          [
            `I can not find case entry from target data constructor name.`,
            `  target data constructor name: ${data_ctor.name}`,
            `  case entries names: ${case_entries_names.join(", ")}`,
          ].join("\n")
        )
      }

      if (!data_ctor.is_direct_positive_recursive) {
        return Exps.apply_arg_value_entries(
          case_entry.value,
          target.arg_value_entries
        )
      }

      const properties: Map<string, Value> = new Map()
      const almost = new Exps.ObjValue(properties)
      const entries = target.arg_value_entries.entries()
      for (const [index, arg_value_entry] of entries) {
        if (data_ctor.is_direct_positive_recursive_position(index)) {
          properties.set(
            data_ctor.direct_positive_recursive_position_name(index),
            Exps.InductionCore.apply(
              arg_value_entry.value,
              motive,
              case_entries
            )
          )
        }
      }

      return Exps.apply_arg_value_entries(case_entry.value, [
        ...target.arg_value_entries,
        { kind: "plain", value: almost },
      ])
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.DataValue],
      })
    }

    let target_t = target.t
    if (target_t instanceof Exps.TypeCtorValue && target_t.arity === 0) {
      target_t = target_t.as_datatype()
    }

    if (!(target_t instanceof Exps.DatatypeValue)) {
      throw InternalError.wrong_target_t(target_t, {
        expected: [Exps.DatatypeValue],
      })
    }

    const datatype = target_t

    throw new Error("TODO")

    // const motive_t = 1

    // return new Exps.NotYetValue(
    //   Exps.apply_args(motive, [...datatype.varied_args, target]),
    //   new Exps.InductionNeutral(
    //     target.neutral,
    //     new Normal(motive_t, motive),
    //     case_entries.map((case_entry) => ({
    //       ...case_entry,
    //       normal: new Normal(case_t, case_entry.value),
    //     }))
    //   )
    // )
  }
}
