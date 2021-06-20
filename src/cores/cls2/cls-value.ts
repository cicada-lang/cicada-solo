import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"
import { ClsClosure } from "./cls-closure"

export abstract class Cls2Value extends Value {
  instanceofCoresCls2Value = true

  abstract field_names: Array<string>
  abstract readback(ctx: Ctx, t: Value): Core | undefined
  abstract check_properties(
    ctx: Ctx,
    properties: Map<string, Exp>
  ): Map<string, Core>
  eta_expand?(ctx: Ctx, value: Value): Core
}

export class ClsNilValue extends Cls2Value {
  get field_names(): Array<string> {
    return []
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return new Map()
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.ClsNil()
    }
  }

  // eta_expand(ctx: Ctx, value: Value): Core {
  //   // TODO
  // }
}

export class ClsConsValue extends Cls2Value {
  field_name: string
  field_t: Value
  rest_t_cl: ClsClosure

  constructor(field_name: string, field_t: Value, rest_t_cl: ClsClosure) {
    super()
    this.field_name = field_name
    this.field_t = field_t
    this.rest_t_cl = rest_t_cl
  }

  get field_names(): Array<string> {
    return [this.field_name, ...this.rest_t_cl.rest_t.field_names]
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    const exp = properties.get(this.field_name)

    if (exp === undefined) {
      throw new Trace(`I expect to find field: ${this.field_name}`)
    }

    const field_core = check(ctx, exp, this.field_t)
    const rest_t_value = this.rest_t_cl.apply(
      evaluate(ctx.to_env(), field_core)
    )

    return new Map([
      [this.field_name, field_core],
      ...rest_t_value.check_properties(ctx, properties),
    ])
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

  // eta_expand(ctx: Ctx, value: Value): Core {
  //   // TODO
  // }
}
