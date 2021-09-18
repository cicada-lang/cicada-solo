import { Ctx } from "../ctx"
import { Core } from "../core"
import { Subst } from "../subst"

export abstract class Value {
  abstract readback(ctx: Ctx, t: Value): Core | undefined

  unify(subst: Subst, that: Value): Subst {
    throw new Error("Method not implemented: unify")
  }
}
