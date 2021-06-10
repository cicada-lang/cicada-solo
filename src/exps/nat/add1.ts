import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"
import * as Cores from "../../cores"

export class Add1 extends Exp {
  prev: Exp

  constructor(prev: Exp) {
    super()
    this.prev = prev
  }

  subst(name: string, exp: Exp): Exp {
    return new Add1(this.prev.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.NatValue(),
      core: new Cores.Add1(check(ctx, this.prev, new Cores.NatValue())),
    }
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }
}
