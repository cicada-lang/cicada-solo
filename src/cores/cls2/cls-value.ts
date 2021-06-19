import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../readback"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export abstract class Cls2Value extends Value {
  instanceofCoresCls2Value = true

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

export class ClsConsValue extends Cls2Value {
  field_name: string
  field_t: Value
  rest_t_cl: Closure

  constructor(field_name: string, field_t: Value, rest_t_cl: Closure) {
    super()
    this.field_name = field_name
    this.field_t = field_t
    this.rest_t_cl = rest_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      // TODO
      return new Cores.ClsNil()
    }
  }

  // eta_expand(ctx: Ctx, value: Value): Core {}
}
