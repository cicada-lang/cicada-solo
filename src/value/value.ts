import { Ctx } from "../ctx"
import { Core } from "../core"
import { Subst } from "../subst"

export abstract class Value {
  instanceofValue = true

  abstract readback(ctx: Ctx, t: Value): Core | undefined
  eta_expand?(ctx: Ctx, value: Value): Core

  unify(subst: Subst, that: Value): Subst {
    throw new Error("Method not implemented: unify")
  }
}
