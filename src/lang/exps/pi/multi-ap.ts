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

export class MultiAp extends Exp {
  meta: ExpMeta
  target: Exp
  entries: Array<ArgEntry>

  constructor(target: Exp, entries: Array<ArgEntry>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.entries = entries
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.entries.flatMap((entry) =>
        Array.from(entry.arg.free_names(bound_names))
      ),
    ])
  }

  subst(name: string, exp: Exp): MultiAp {
    return new MultiAp(
      subst(this.target, name, exp),
      this.entries.map((entry) => ({
        ...entry,
        arg: subst(entry.arg, name, exp),
      })),
      this.meta
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.target)
    if (inferred.t instanceof Exps.ReturnedPiValue) {
      // TODO
      console.log(`Checking Exps.ReturnedPiValue`)
      console.log(`  target: ${this.target.format()}`)
    }

    return check_by_infer(ctx, this, t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    let result: Exp = this.target
    for (const entry of this.entries) {
      if (entry.kind === "implicit") {
        result = new Exps.ImplicitAp(result, entry.arg, this.meta)
      } else if (entry.kind === "returned") {
        result = new Exps.ReturnedAp(result, entry.arg, this.meta)
      } else {
        result = new Exps.Ap(result, entry.arg, this.meta)
      }
    }

    return infer(ctx, result)
  }

  format(): string {
    const target = this.target.format()
    const entries = this.entries
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
