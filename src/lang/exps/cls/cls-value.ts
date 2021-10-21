import { Ctx } from "../../ctx"
import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion } from "../../value"

export abstract class ClsValue extends Value implements ReadbackEtaExpansion {
  instanceofExpsClsValue = true

  constructor() {
    super()
  }

  abstract field_names: Array<string>
  abstract readback(ctx: Ctx, t: Value): Core | undefined
  abstract check_properties(
    ctx: Ctx,
    properties: Map<string, Exp>
  ): Map<string, Core>

  abstract dot_value(target: Value, field_name: string): Value
  abstract dot_type(target: Value, field_name: string): Value

  abstract eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core>

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    return new Exps.ObjCore(this.eta_expand_properties(ctx, value))
  }

  abstract extend_ctx(
    ctx: Ctx,
    renamings: Array<{ field_name: string; local_name: string }>
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  }

  abstract apply(arg: Value): ClsValue
}
