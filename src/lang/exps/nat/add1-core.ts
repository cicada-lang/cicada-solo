import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { nat_to_number } from "./nat-util"
import * as Exps from "../../exps"

export class Add1Core extends Core {
  prev: Core

  constructor(prev: Core) {
    super()
    this.prev = prev
  }

  evaluate(env: Env): Value {
    return new Exps.Add1Value(evaluate(env, this.prev))
  }

  format(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.format()})`
    }
  }

  alpha_format(ctx: AlphaCtx): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.alpha_format(ctx)})`
    }
  }
}
