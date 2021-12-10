import * as ut from "../../../ut"
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ConsCls extends Exps.Cls {
  meta: ExpMeta
  field_names: Array<string>
  // NOTE We can not only use `field_name` we also need `local_name`,
  //   because of `subst` might rename bound variables.
  field_name: string
  local_name: string
  field_t: Exp
  rest_t: Exps.Cls

  constructor(
    field_name: string,
    local_name: string,
    field_t: Exp,
    rest_t: Exps.Cls,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t

    if (rest_t.field_names.includes(field_name)) {
      throw new ExpTrace(
        [
          `I found duplicated field name in class`,
          `field name:`,
          `  ${field_name}`,
          `field names:`,
          `  ${field_name}, ${rest_t.field_names.join(", ")}`,
        ].join("\n")
      )
    }

    this.field_names = [field_name, ...rest_t.field_names]
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.field_t.free_names(bound_names),
      ...this.rest_t.free_names(new Set([...bound_names, this.local_name])),
    ])
  }

  subst(name: string, exp: Exp): Exps.Cls {
    if (name === this.local_name) {
      return new ConsCls(
        this.field_name,
        this.local_name,
        subst(this.field_t, name, exp),
        this.rest_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.local_name)

      return new ConsCls(
        this.field_name,
        fresh_name,
        subst(this.field_t, name, exp),
        subst(
          subst(this.rest_t, this.local_name, new Exps.Variable(fresh_name)),
          name,
          exp
        ) as Exps.Cls,
        this.meta
      )
    }
  }

  fields_format(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.format()}`,
      ...this.rest_t.fields_format(),
    ]
  }

  format(): string {
    const fields = this.fields_format().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.local_name)
    const field_t_core = check(ctx, this.field_t, new Exps.TypeValue())
    const field_t_value = evaluate(ctx.to_env(), field_t_core)
    const rest_t = subst(
      this.rest_t,
      this.local_name,
      new Exps.Variable(fresh_name)
    )
    const rest_t_core = check(
      ctx.extend(fresh_name, field_t_value),
      rest_t,
      new Exps.TypeValue()
    )

    if (!(rest_t_core instanceof Exps.ClsCore)) {
      throw new ExpTrace("I expect rest_t_core to be Exps.Cls")
    }

    return {
      t: new Exps.TypeValue(),
      core: new Exps.ConsClsCore(
        this.field_name,
        fresh_name,
        field_t_core,
        rest_t_core
      ),
    }
  }
}
