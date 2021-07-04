import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ClsFulfilled extends Exps.Cls {
  field_name: string
  local_name: string
  field_t: Exp
  field: Exp
  rest_t: Exps.Cls

  constructor(
    field_name: string,
    local_name: string,
    field_t: Exp,
    field: Exp,
    rest_t: Exps.Cls
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.field = field
    this.rest_t = rest_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.field_t.free_names(bound_names),
      ...this.field.free_names(bound_names),
      ...this.rest_t.free_names(new Set([...bound_names, this.local_name])),
    ])
  }

  subst(name: string, exp: Exp): Exps.Cls {
    if (name === this.local_name) {
      return new ClsFulfilled(
        this.field_name,
        this.local_name,
        this.field_t.subst(name, exp),
        this.field.subst(name, exp),
        this.rest_t
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.local_name)

      return new ClsFulfilled(
        this.field_name,
        fresh_name,
        this.field_t.subst(name, exp),
        this.field.subst(name, exp),
        this.rest_t
          .subst(this.local_name, new Exps.Var(fresh_name))
          .subst(name, exp)
      )
    }
  }

  fields_repr(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.repr()} = ${this.field.repr()}`,
      ...this.rest_t.fields_repr(),
    ]
  }

  repr(): string {
    const fields = this.fields_repr().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.local_name)
    const field_t_core = check(ctx, this.field_t, new Exps.TypeValue())
    const field_t_value = evaluate(ctx.to_env(), field_t_core)
    const field_core = check(ctx, this.field, field_t_value)
    const field_value = evaluate(ctx.to_env(), field_core)
    const rest_t = this.rest_t.subst(this.local_name, new Exps.Var(fresh_name))
    const rest_t_core = check(
      ctx.extend(fresh_name, field_t_value, field_value),
      rest_t,
      new Exps.TypeValue()
    )

    if (!(rest_t_core instanceof Exps.ClsCore)) {
      throw new Trace("I expect rest_t_core to be Exps.Cls")
    }

    return {
      t: new Exps.TypeValue(),
      core: new Exps.ClsFulfilledCore(
        this.field_name,
        fresh_name,
        field_t_core,
        field_core,
        rest_t_core
      ),
    }
  }
}
