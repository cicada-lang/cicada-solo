import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import { ClsClosure } from "./cls-closure"

export class ClsConsValue extends Exps.ClsValue {
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
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ut.freshen_name(
        new Set(ctx.names),
        this.rest_t_cl.local_name
      )
      const variable = new Exps.NotYetValue(
        this.field_t,
        new Exps.VarNeutral(fresh_name)
      )
      const field_t = readback(ctx, new Exps.TypeValue(), this.field_t)
      const rest_t = readback(
        ctx.extend(fresh_name, this.field_t),
        new Exps.TypeValue(),
        this.rest_t_cl.apply(variable)
      )

      if (!(rest_t instanceof Exps.ClsCore)) {
        throw new Trace(
          `I expect rest_t to be an instance of ${Exps.ClsCore.name}`
        )
      }

      return new Exps.ClsConsCore(this.field_name, fresh_name, field_t, rest_t)
    }
  }

  dot_value(target: Value, field_name: string): Value {
    if (field_name === this.field_name) {
      return Exps.DotCore.apply(target, this.field_name)
    } else {
      return this.rest_t_cl
        .apply(Exps.DotCore.apply(target, this.field_name))
        .dot_value(target, field_name)
    }
  }

  dot_type(target: Value, field_name: string): Value {
    if (field_name === this.field_name) {
      return this.field_t
    } else {
      return this.rest_t_cl
        .apply(Exps.DotCore.apply(target, this.field_name))
        .dot_type(target, field_name)
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    const property_value = Exps.DotCore.apply(value, this.field_name)

    return new Map([
      [this.field_name, readback(ctx, this.field_t, property_value)],
      ...this.rest_t_cl.apply(property_value).eta_expand_properties(ctx, value),
    ])
  }

  extend_ctx(
    ctx: Ctx,
    renamings: Array<{ field_name: string; local_name: string }>
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.field_name)
    const variable = new Exps.NotYetValue(
      this.field_t,
      new Exps.VarNeutral(fresh_name)
    )

    return this.rest_t_cl
      .apply(variable)
      .extend_ctx(ctx.extend(fresh_name, this.field_t), [
        ...renamings,
        { field_name: this.field_name, local_name: fresh_name },
      ])
  }

  apply(arg: Value): Exps.ClsValue {
    return new Exps.ClsFulfilledValue(
      this.field_name,
      this.rest_t_cl.local_name,
      this.field_t,
      arg,
      this.rest_t_cl.apply(arg)
    )
  }
}
