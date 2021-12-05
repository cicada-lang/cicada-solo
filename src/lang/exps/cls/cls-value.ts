import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion, Value } from "../../value"
import { ClsApHandler } from "./cls-ap-handler"

export abstract class ClsValue extends Value implements ReadbackEtaExpansion {
  instanceofExpsClsValue = true

  constructor() {
    super()
  }

  abstract ap_handler: ClsApHandler

  abstract field_names: Array<string>
  abstract readback(ctx: Ctx, t: Value): Core | undefined
  abstract check_properties(
    ctx: Ctx,
    properties: Map<string, Exp>
  ): Map<string, Core>

  abstract get_value(target: Value, field_name: string): Value
  abstract get_type(target: Value, field_name: string): Value

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
}
