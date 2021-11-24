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

export class MultiAp extends Exp {
  meta: ExpMeta
  target: Exp
  args: Array<Exp>

  constructor(target: Exp, args: Array<Exp>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
    this.args = args
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.args.flatMap((arg) => Array.from(arg.free_names(bound_names))),
    ])
  }

  subst(name: string, exp: Exp): MultiAp {
    return new MultiAp(
      subst(this.target, name, exp),
      this.args.map((arg) => subst(arg, name, exp)),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  format(): string {
    const target = this.target.format()
    const args = this.args.map((arg) => arg.format()).join(", ")
    return `${target}(${args})`
  }
}
