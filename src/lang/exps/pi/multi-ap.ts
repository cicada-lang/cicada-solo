import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { check_by_infer } from "../../exp"
import { Value } from "../../value"
import { ExpTrace, InternalError } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"
import { ApFormater } from "./ap-formater"

// NOTE The `multi-ap` should not be handled as syntax sugar,
//   using an explicit `multi-ap` expression will give us
//   an opportunity to do check-mode application (which can not be curried).
//   - For example, we can unify the syntax of data construction and function application.

export type ArgEntry = {
  kind: "plain" | "implicit" | "returned"
  arg: Exp
}

export type ArgEntryCore = {
  kind: "plain" | "implicit" | "returned"
  arg: Core
}

export class MultiAp extends Exp {
  meta: ExpMeta
  target: Exp
  arg_entries: Array<ArgEntry>

  constructor(target: Exp, arg_entries: Array<ArgEntry>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.arg_entries = arg_entries
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg_entries.flatMap((entry) =>
        Array.from(entry.arg.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): MultiAp {
    return new MultiAp(
      subst(this.target, name, exp),
      this.arg_entries.map((entry) => ({
        ...entry,
        arg: subst(entry.arg, name, exp),
      })),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.target)

    if (
      inferred.t instanceof Exps.ReturnedPiValue &&
      this.arg_entries[0].kind !== "returned"
    ) {
      return inferred.t.returned_inserter.insert_returned_ap(
        ctx,
        inferred.core,
        this.arg_entries,
        t
      )
    }

    return check_by_infer(ctx, this, t)
  }

  private wrap_arg_entry(target: Exp, arg_entry: ArgEntry): Exp {
    switch (arg_entry.kind) {
      case "implicit": {
        return new Exps.ImplicitAp(target, arg_entry.arg, this.meta)
      }
      case "returned": {
        return new Exps.ReturnedAp(target, arg_entry.arg, this.meta)
      }
      case "plain": {
        return new Exps.Ap(target, arg_entry.arg, this.meta)
      }
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return infer(
      ctx,
      this.arg_entries.reduce(
        (result, arg_entry) => this.wrap_arg_entry(result, arg_entry),
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
            return entry.arg.format()
          case "implicit":
            return `implicit ${entry.arg.format()}`
          case "returned":
            return `returned ${entry.arg.format()}`
        }
      })
      .join(", ")

    return `${target}(${entries})`
  }
}
