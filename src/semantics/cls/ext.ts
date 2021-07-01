import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { infer } from "../../exp"
import { evaluate } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Trace } from "../../errors"
import * as Sem from "../../sem"
import * as ut from "../../ut"

export class Ext extends Exp {
  parent: Exp
  rest_t: Sem.Cls

  constructor(parent: Exp, rest_t: Sem.Cls) {
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

  subst(name: string, exp: Exp): Exp {
    return new Ext(this.parent.subst(name, exp), this.rest_t.subst(name, exp))
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
        rest_t.subst(renaming.field_name, new Sem.Var(renaming.local_name)),
      this.rest_t.subst(
        "super",
        new Sem.Obj(
          parent_value.field_names.map(
            (name) => new Sem.FieldShorthandProp(name)
          )
        )
      )
    )

    const rest_t_core = check(result.ctx, rest_t, new Sem.TypeValue())

    if (!(rest_t_core instanceof Sem.ClsCore)) {
      throw new Trace("I expect rest_t_core to be Sem.Cls")
    }

    const parent_core = readback(ctx, new Sem.TypeValue(), parent_value)

    if (!(parent_core instanceof Sem.ClsCore)) {
      throw new Trace("I expect parent_core to be Sem.Cls")
    }

    return {
      t: new Sem.TypeValue(),
      core: parent_core.append(rest_t_core),
    }
  }

  private get_parent_value(ctx: Ctx): Sem.ClsValue {
    const inferred_parent = infer(ctx, this.parent)
    const parent_value = evaluate(ctx.to_env(), inferred_parent.core)

    if (!(parent_value instanceof Sem.ClsValue)) {
      throw new Trace(
        [
          `I expect parent_value to be Sem.ClsValue,`,
          `but I found class name:`,
          `  ${parent_value.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return parent_value
  }
}
