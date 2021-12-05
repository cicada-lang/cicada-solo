import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

export class VectorTail extends Exp {
  meta: ExpMeta
  target: Exp

  constructor(target: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): VectorTail {
    return new VectorTail(subst(this.target, name, exp), this.meta)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Exps.VectorValue)
    const length = expect(ctx, vector_t.length, Exps.Add1Value)

    return {
      t: new Exps.VectorValue(vector_t.elem_t, length.prev),
      core: new Exps.VectorTailCore(inferred_target.core),
    }
  }

  format(): string {
    return `vector_tail(${this.target.format()})`
  }
}
