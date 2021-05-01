import { Exp } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { Normal } from "../../normal"
import * as Cores from "../../cores"

export class AbsurdInd extends Exp {
  target: Exp
  motive: Exp

  constructor(target: Exp, motive: Exp) {
    super()
    this.target = target
    this.motive = motive
  }

  infer(ctx: Ctx): { t: Value; exp: Core } {
    // NOTE the `motive` here is not a function from target_t to type,
    //   but a element of type.
    // NOTE We should always infer target,
    //   but we do a simple check for the simple absurd.
    check(ctx, this.target, new Cores.AbsurdValue())
    check(ctx, this.motive, new Cores.TypeValue())
    const motive_value = evaluate(ctx.to_env(), this.motive)
    return motive_value
  }

  repr(): string {
    return `absurd_ind(${this.target.repr()}, ${this.motive.repr()})`
  }
}
