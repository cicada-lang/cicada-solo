import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { expect } from "../../value"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class VectorTail extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.target.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new VectorTail(this.target.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Sem.VectorValue)
    const length = expect(ctx, vector_t.length, Sem.Add1Value)

    return {
      t: new Sem.VectorValue(vector_t.elem_t, length.prev),
      core: new Sem.VectorTail(inferred_target.core),
    }
  }

  repr(): string {
    return `vector_tail(${this.target.repr()})`
  }
}
