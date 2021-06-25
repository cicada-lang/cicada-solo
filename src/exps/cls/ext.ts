import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { infer } from "../../infer"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
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

  subst(name: string, exp: Exp): Exp {
    return new Ext(this.parent.subst(name, exp), this.rest_t.subst(name, exp))
  }

  repr(): string {
    const parent = this.parent.repr()
    const fields = this.rest_t.fields_repr().join("\n")
    return `class extends ${parent} {\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const result = this.parent_extend_ctx(ctx, this.get_parent_value(ctx))
    const rest_t = result.renamings.reduce(
      (rest_t, renaming) =>
        rest_t.subst(renaming.field_name, new Exps.Var(renaming.local_name)),
      this.rest_t
    )
    const rest_t_core = check(result.ctx, rest_t, new Cores.TypeValue())

    return {
      t: new Cores.TypeValue(),
      // TODO
      // core: this.get_parent_core(ctx).append(rest_t_core),
      core: rest_t_core,
    }
  }

  private get_parent_core(ctx: Ctx): Cores.Cls {
    const inferred_parent = infer(ctx, this.parent)

    if (!(inferred_parent.core instanceof Cores.Cls)) {
      throw new Trace(`Expecting inferred_parent.core to be Cls`)
    }

    return inferred_parent.core
  }

  private get_parent_value(ctx: Ctx): Cores.ClsValue {
    const parent_value = evaluate(ctx.to_env(), this.get_parent_core(ctx))

    if (!(parent_value instanceof Cores.ClsValue)) {
      throw new Trace(`Expecting parent_value to be ClsValue`)
    }

    return parent_value
  }

  private parent_extend_ctx(
    ctx: Ctx,
    parent: Cores.ClsValue,
    renamings: Array<{ field_name: string; local_name: string }> = new Array()
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  } {
    if (parent instanceof Cores.ClsNilValue) {
      return { ctx, renamings }
    }

    if (parent instanceof Cores.ClsConsValue) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), parent.field_name)
      const variable = new Cores.NotYetValue(
        parent.field_t,
        new Cores.VarNeutral(fresh_name)
      )

      return this.parent_extend_ctx(
        ctx.extend(fresh_name, parent.field_t),
        parent.rest_t_cl.apply(variable),
        [
          ...renamings,
          { field_name: parent.field_name, local_name: fresh_name },
        ]
      )
    }

    throw new Trace(
      `The parent is of unknown subclass of ClsValue ${parent.constructor.name}`
    )
  }
}
