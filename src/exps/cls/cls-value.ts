import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import { ClsClosure } from "./cls-closure"

export abstract class ClsValue extends Value {
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

  eta_expand(ctx: Ctx, value: Value): Core {
    return new Exps.ObjCore(this.eta_expand_properties(ctx, value))
  }

  abstract extend_ctx(
    ctx: Ctx,
    renamings: Array<{ field_name: string; local_name: string }>
  ): {
    ctx: Ctx
    renamings: Array<{ field_name: string; local_name: string }>
  }

  abstract apply(arg: Value): Value
}
