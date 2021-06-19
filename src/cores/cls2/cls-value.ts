import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../readback"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Trace } from "../../trace"
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
      const fresh_name = ut.freshen_name(
        new Set(ctx.names),
        this.rest_t_cl.name
      )
      const variable = new Cores.NotYetValue(
        this.field_t,
        new Cores.VarNeutral(fresh_name)
      )
      const field_t = readback(ctx, new Cores.TypeValue(), this.field_t)
      const rest_t = readback(
        ctx.extend(fresh_name, this.field_t),
        new Cores.TypeValue(),
        this.rest_t_cl.apply(variable)
      )

      if (!(rest_t instanceof Cores.Cls2)) {
        throw new Trace("I expect rest_t to be Cores.Cls2")
      }

      return new Cores.ClsCons(this.field_name, fresh_name, field_t, rest_t)
    }
  }

  // eta_expand(ctx: Ctx, value: Value): Core {}
}
