import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../readback"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export abstract class Cls2Value extends Value {
  abstract readback(ctx: Ctx, t: Value): Core | undefined
  eta_expand?(ctx: Ctx, value: Value): Core
}

export class ClsNilValue extends Cls2Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.ClsNil()
    }
  }

  // eta_expand(ctx: Ctx, value: Value): Core {}
}
