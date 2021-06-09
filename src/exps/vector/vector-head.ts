import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class VectorHead extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  subst(name: string, exp: Exp): Exp {
    return new VectorHead(this.target.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Cores.VectorValue)
    expect(ctx, vector_t.length, Cores.Add1Value)

    return {
      t: vector_t.elem_t,
      core: new Cores.VectorHead(inferred_target.core),
    }
  }

  repr(): string {
    return `vector_head(${this.target.repr()})`
  }
}
