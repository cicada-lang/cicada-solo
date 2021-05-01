import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"
import { Add1Value } from "../../cores"

export class Add1 extends Core {
  prev: Core

  constructor(prev: Core) {
    super()
    this.prev = prev
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new Add1Value(evaluate(ctx, env, this.prev))
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }

  alpha_repr(ctx: AlphaCtx): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.alpha_repr(ctx)})`
    }
  }
}
