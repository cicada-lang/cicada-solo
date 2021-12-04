import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { nat_to_number } from "./nat-util"
import * as Exps from "../../exps"

export class Add1 extends Exp {
  meta: ExpMeta
  prev: Exp

  constructor(prev: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.prev = prev
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.prev.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Add1(subst(this.prev, name, exp), this.meta)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.NatValue(),
      core: new Exps.Add1Core(check(ctx, this.prev, new Exps.NatValue())),
    }
  }

  format(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.format()})`
    }
  }
}
