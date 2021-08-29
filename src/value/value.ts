import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Core } from "../core"
import { Trace } from "../errors"
import { Subst } from "../value"

export abstract class Value {
  instanceofValue = true

  abstract readback(ctx: Ctx, t: Value): Core | undefined
  eta_expand?(ctx: Ctx, value: Value): Core

  unify(subst: Subst, x: Value): Subst | undefined {
    throw new Error("Method not implemented: unify")
  }
}
