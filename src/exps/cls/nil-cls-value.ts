import { Ctx } from "../../ctx"
import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"

export class NilClsValue extends Exps.ClsValue {
  get field_names(): Array<string> {
    return []
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return new Map()
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.NilClsCore()
    }
  }

  dot_value(target: Value, field_name: string): Value {
    throw new ExpTrace(
      [
        `I can not dot the value out of class`,
        `because I meet an unknown field name:`,
        `  ${field_name}`,
      ].join("\n") + "\n"
    )
  }

  dot_type(target: Value, field_name: string): Value {
    throw new ExpTrace(
      [
        `I can not dot the type out of class`,
        `because I meet an unknown field name:`,
        `  ${field_name}`,
      ].join("\n") + "\n"
    )
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return new Map()
  }

  extend_ctx(
    ctx: Ctx,
    renamings: Array<{ field_name: string; local_name: string }>
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  } {
    return { ctx, renamings }
  }

  apply(arg: Value): Exps.ClsValue {
    throw new ExpTrace(
      [
        `I meet the end of ClsValue`,
        `I can not apply arg to it anymore`,
        `arg class name: ${arg.constructor.name}`,
      ].join("\n") + "\n"
    )
  }
}
