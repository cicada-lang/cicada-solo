import * as ut from "../../../ut"
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"

export class Ext extends Exp {
  meta: ExpMeta
  parent: Exp
  rest_t: Exps.Cls

  constructor(parent: Exp, rest_t: Exps.Cls, meta: ExpMeta) {
    super()
    this.meta = meta
    this.parent = parent
    this.rest_t = rest_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.parent.free_names(bound_names),
      ...this.rest_t.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Ext(
      subst(this.parent, name, exp),
      subst(this.rest_t, name, exp) as Exps.Cls,
      this.meta
    )
  }

  format(): string {
    const parent = this.parent.format()
    const fields = this.rest_t.fields_format().join("\n")
    return `class extends ${parent} {\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const parent_value = this.get_parent_value(ctx)
    const result = parent_value.extend_ctx(ctx, [])
    const rest_t = result.renamings.reduce(
      (rest_t, renaming) =>
        subst(rest_t, renaming.field_name, new Exps.Var(renaming.local_name)),
      subst(
        this.rest_t,
        "super",
        new Exps.Obj(
          parent_value.field_names.map(
            (name) => new Exps.FieldShorthandProp(name)
          )
        )
      )
    )

    const rest_t_core = check(result.ctx, rest_t, new Exps.TypeValue())

    if (!(rest_t_core instanceof Exps.ClsCore)) {
      throw new ElaborationError("I expect rest_t_core to be Exps.Cls")
    }

    const parent_core = readback(ctx, new Exps.TypeValue(), parent_value)

    if (!(parent_core instanceof Exps.ClsCore)) {
      throw new ElaborationError("I expect parent_core to be Exps.Cls")
    }

    return {
      t: new Exps.TypeValue(),
      core: parent_core.append(rest_t_core),
    }
  }

  private get_parent_value(ctx: Ctx): Exps.ClsValue {
    const inferred_parent = infer(ctx, this.parent)
    const parent_value = evaluate(ctx.toEnv(), inferred_parent.core)

    if (!(parent_value instanceof Exps.ClsValue)) {
      throw new ElaborationError(
        [
          `I expect parent_value to be Exps.ClsValue,`,
          `but I found class name:`,
          `  ${parent_value.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return parent_value
  }
}
