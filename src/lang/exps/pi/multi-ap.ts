import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, check_by_infer, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

// NOTE The `multi-ap` should not be handled as syntax sugar,
//   using an explicit `multi-ap` expression will give us
//   an opportunity to do check-mode application (which can not be curried).
//   - For example, we can unify the syntax of data construction and function application.

export class MultiAp extends Exp {
  meta: ExpMeta
  target: Exp
  arg_entries: Array<Exps.ArgEntry>

  constructor(target: Exp, arg_entries: Array<Exps.ArgEntry>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.arg_entries = arg_entries
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg_entries.flatMap((entry) =>
        Array.from(entry.exp.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): MultiAp {
    return new MultiAp(
      subst(this.target, name, exp),
      this.arg_entries.map((entry) => ({
        ...entry,
        exp: subst(entry.exp, name, exp),
      })),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.target)
    const first_arg_entry = this.arg_entries[0]

    if (inferred.t instanceof Exps.VaguePiValue) {
      if (first_arg_entry && first_arg_entry.kind === "vague") {
        const next_multi_ap = new Exps.MultiAp(
          new Exps.VagueAp(this.target, first_arg_entry.exp, this.meta),
          this.arg_entries.slice(1),
          this.meta
        )
        return check(ctx, next_multi_ap, t)
      } else {
        // { // DEBUG
        //   console.log({
        //     msg: "[MultiAp.check] before",
        //     target: this.target.format(),
        //     arg_entries: this.arg_entries
        //       .map((arg_entry) => `${arg_entry.kind} ${arg_entry.exp.format()}`)
        //       .join(", "),
        //   })
        // }

        const result = inferred.t.vague_inserter.insert_vague_ap(
          ctx,
          inferred.core,
          this.arg_entries,
          t
        )

        // { // DEBUG
        //   console.log({
        //     msg: "[MultiAp.check] after",
        //     target: this.target.format(),
        //     arg_entries: this.arg_entries
        //       .map((arg_entry) => `${arg_entry.kind} ${arg_entry.exp.format()}`)
        //       .join(", "),
        //     result: result.format(),
        //   })
        // }

        return result
      }
    }

    return check_by_infer(ctx, this, t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return infer(
      ctx,
      this.arg_entries.reduce(
        (result, arg_entry) =>
          Exps.build_ap_from_arg_entry(result, arg_entry, this.meta),
        this.target
      )
    )
  }

  format(): string {
    const target = this.target.format()
    const entries = this.arg_entries
      .map((entry) => {
        switch (entry.kind) {
          case "plain":
            return entry.exp.format()
          case "implicit":
            return `implicit ${entry.exp.format()}`
          case "vague":
            return `vague ${entry.exp.format()}`
        }
      })
      .join(", ")

    return `${target}(${entries})`
  }
}
