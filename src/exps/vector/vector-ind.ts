import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class VectorInd extends Exp {
  length: Exp
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(length: Exp, target: Exp, motive: Exp, base: Exp, step: Exp) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Cores.VectorValue)
    throw new Error("TODO")

    // return {
    //   t: new Cores.VectorValue(vector_t.elem_t, length.prev),
    //   core: new Cores.VectorTail(inferred_target.core),
    // }
  }

  repr(): string {
    const args = [
      this.length.repr(),
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `vector_ind(${args})`
  }
}
