import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"

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
