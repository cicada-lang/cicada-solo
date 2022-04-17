import * as ut from "../../../ut"
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class FulfilledCls extends Exps.Cls {
  meta: ExpMeta
  field_names: Array<string>
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
    rest_t: Exps.Cls,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.field = field
    this.rest_t = rest_t
    this.field_names = [field_name, ...rest_t.field_names]
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
      return new FulfilledCls(
        this.field_name,
        this.local_name,
        subst(this.field_t, name, exp),
        subst(this.field, name, exp),
        this.rest_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.local_name)

      return new FulfilledCls(
        this.field_name,
        fresh_name,
        subst(this.field_t, name, exp),
        subst(this.field, name, exp),
        subst(
          subst(this.rest_t, this.local_name, new Exps.Var(fresh_name)),
          name,
          exp
        ) as Exps.Cls,
        this.meta
      )
    }
  }

  fields_format(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.format()} = ${this.field.format()}`,
      ...this.rest_t.fields_format(),
    ]
  }

  format(): string {
    const fields = this.fields_format().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  private assertNoDuplicatedName(): void {
    if (this.rest_t.field_names.includes(this.field_name)) {
      throw new ElaborationError(
        [
          `I found duplicated field name in class`,
          `field name:`,
          `  ${this.field_name}`,
          `field names:`,
          `  ${this.field_name}, ${this.rest_t.field_names.join(", ")}`,
        ].join("\n")
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    this.assertNoDuplicatedName()

    const fresh_name = ctx.freshen(this.local_name)
    const field_t_core = check(ctx, this.field_t, new Exps.TypeValue())
    const field_t_value = evaluate(ctx.toEnv(), field_t_core)
    const field_core = check(ctx, this.field, field_t_value)
    const field_value = evaluate(ctx.toEnv(), field_core)
    const rest_t = subst(this.rest_t, this.local_name, new Exps.Var(fresh_name))
    const rest_t_core = check(
      ctx.extend(fresh_name, field_t_value, field_value),
      rest_t,
      new Exps.TypeValue()
    )

    if (!(rest_t_core instanceof Exps.ClsCore)) {
      throw new ElaborationError("I expect rest_t_core to be Exps.Cls")
    }

    return {
      t: new Exps.TypeValue(),
      core: new Exps.FulfilledClsCore(
        this.field_name,
        fresh_name,
        field_t_core,
        field_core,
        rest_t_core
      ),
    }
  }
}
