import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { Solution } from "../../solution"
import { check, Exp } from "../../exp"
import * as Exps from "../../exps"
import { check_conversion, readback, Value } from "../../value"
import { FulfilledClsApHandler } from "./fulfilled-cls-ap-handler"

export class FulfilledClsValue extends Exps.ClsValue {
  field_name: string
  local_name: string
  field_t: Value
  field: Value
  rest_t: Exps.ClsValue

  constructor(
    field_name: string,
    local_name: string,
    field_t: Value,
    field: Value,
    rest_t: Exps.ClsValue
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.field = field
    this.rest_t = rest_t
  }

  ap_handler = new FulfilledClsApHandler(this)

  get field_names(): Array<string> {
    return [this.field_name, ...this.rest_t.field_names]
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    const exp = properties.get(this.field_name)

    if (exp === undefined) {
      throw new ExpTrace(`I expect to find field: ${this.field_name}`)
    }

    const field_core = check(ctx, exp, this.field_t)
    const field_value = evaluate(ctx.to_env(), field_core)

    check_conversion(ctx, this.field_t, field_value, this.field, {
      description: {
        from: "given field value",
        to: "already fulfilled value",
      },
    })

    return new Map([
      [this.field_name, field_core],
      ...this.rest_t.check_properties(ctx, properties),
    ])
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ctx.freshen(this.local_name)

      const field_t = readback(ctx, new Exps.TypeValue(), this.field_t)
      const field_core = readback(ctx, this.field_t, this.field)

      const rest_t = readback(
        ctx.extend(fresh_name, this.field_t, this.field),
        new Exps.TypeValue(),
        this.rest_t
      )

      if (!(rest_t instanceof Exps.ClsCore)) {
        throw new ExpTrace(
          `I expect rest_t to be an instance of ${Exps.ClsCore.name}`
        )
      }

      return new Exps.FulfilledClsCore(
        this.field_name,
        fresh_name,
        field_t,
        field_core,
        rest_t
      )
    }
  }

  get_value(target: Value, field_name: string): Value {
    if (field_name === this.field_name) {
      return this.field
    } else {
      return this.rest_t.get_value(target, field_name)
    }
  }

  get_type(target: Value, field_name: string): Value {
    if (field_name === this.field_name) {
      return this.field_t
    } else {
      return this.rest_t.get_type(target, field_name)
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return new Map([
      [this.field_name, readback(ctx, this.field_t, this.field)],
      ...this.rest_t.eta_expand_properties(ctx, value),
    ])
  }

  extend_ctx(
    ctx: Ctx,
    renamings: Array<{ field_name: string; local_name: string }>
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  } {
    const fresh_name = ctx.freshen(this.field_name)

    return this.rest_t.extend_ctx(
      ctx.extend(fresh_name, this.field_t, this.field),
      [...renamings, { field_name: this.field_name, local_name: fresh_name }]
    )
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.FulfilledClsValue)) {
      return Solution.failure
    }

    if (!(this.field_name !== that.field_name)) {
      return Solution.failure
    }

    return solution
      .unify_type(ctx, this.field_t, that.field_t)
      .unify(ctx, this.field_t, this.field, that.field)
      .unify_type(ctx, this.rest_t, that.rest_t)
  }
}
