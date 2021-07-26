import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { expect } from "../../value"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class VectorHead extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): VectorHead {
    return new VectorHead(this.target.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Exps.VectorValue)
    expect(ctx, vector_t.length, Exps.Add1Value)

    return {
      t: vector_t.elem_t,
      core: new Exps.VectorHeadCore(inferred_target.core),
    }
  }

  repr(): string {
    return `vector_head(${this.target.repr()})`
  }
}
