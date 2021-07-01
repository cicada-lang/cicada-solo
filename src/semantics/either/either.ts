import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../exp"
import { evaluate } from "../../core"
import * as Sem from "../../sem"

export class Either extends Exp {
  left_t: Exp
  right_t: Exp

  constructor(left_t: Exp, right_t: Exp) {
    super()
    this.left_t = left_t
    this.right_t = right_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.left_t.free_names(bound_names),
      ...this.right_t.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Either(
      this.left_t.subst(name, exp),
      this.right_t.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const left_t_core = check(ctx, this.left_t, new Sem.TypeValue())
    const right_t_core = check(ctx, this.right_t, new Sem.TypeValue())

    return {
      t: new Sem.TypeValue(),
      core: new Sem.EitherCore(left_t_core, right_t_core),
    }
  }

  repr(): string {
    const args = [this.left_t.repr(), this.right_t.repr()].join(", ")

    return `Either(${args})`
  }
}
