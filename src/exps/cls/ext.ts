import { Exp, substitute } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { infer } from "../../exp"
import { evaluate } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Ext extends Exp {
  parent: Exp
  rest_t: Exps.Cls

  constructor(parent: Exp, rest_t: Exps.Cls) {
    super()
    this.parent = parent
    this.rest_t = rest_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.parent.free_names(bound_names),
      ...this.rest_t.free_names(bound_names),
    ])
  }

  substitute(name: string, exp: Exp): Exp {
    return new Ext(
      substitute(this.parent, name, exp),
      substitute(this.rest_t, name, exp) as Exps.Cls
    )
  }

  repr(): string {
    const parent = this.parent.repr()
    const fields = this.rest_t.fields_repr().join("\n")
    return `class extends ${parent} {\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const parent_value = this.get_parent_value(ctx)
    const result = parent_value.extend_ctx(ctx, [])
    const rest_t = result.renamings.reduce(
      (rest_t, renaming) =>
        substitute(
          rest_t,
          renaming.field_name,
          new Exps.Var(renaming.local_name)
        ),
      substitute(
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
      throw new Trace("I expect rest_t_core to be Exps.Cls")
    }

    const parent_core = readback(ctx, new Exps.TypeValue(), parent_value)

    if (!(parent_core instanceof Exps.ClsCore)) {
      throw new Trace("I expect parent_core to be Exps.Cls")
    }

    return {
      t: new Exps.TypeValue(),
      core: parent_core.append(rest_t_core),
    }
  }

  private get_parent_value(ctx: Ctx): Exps.ClsValue {
    const inferred_parent = infer(ctx, this.parent)
    const parent_value = evaluate(ctx.to_env(), inferred_parent.core)

    if (!(parent_value instanceof Exps.ClsValue)) {
      throw new Trace(
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
