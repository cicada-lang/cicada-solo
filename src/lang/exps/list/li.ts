import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { infer } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Li extends Exp {
  meta: ExpMeta
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.head = head
    this.tail = tail
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.head.free_names(bound_names),
      ...this.tail.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Li(
      subst(this.head, name, exp),
      subst(this.tail, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_head = infer(ctx, this.head)
    const list_t = new Exps.ListValue(inferred_head.t)
    const tail_core = check(ctx, this.tail, list_t)

    return {
      t: list_t,
      core: new Exps.LiCore(inferred_head.core, tail_core),
    }
  }

  format(): string {
    return `li(${this.head.format()}, ${this.tail.format()})`
  }
}
