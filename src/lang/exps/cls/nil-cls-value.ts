import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"
import { NilClsApHandler } from "./nil-cls-ap-handler"

export class NilClsValue extends Exps.ClsValue {
  get field_names(): Array<string> {
    return []
  }

  ap_handler = new NilClsApHandler()

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return new Map()
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.NilClsCore()
    }
  }

  get_value(target: Value, field_name: string): Value {
    throw new ExpTrace(
      [
        `I can not dot the value out of class`,
        `because I meet an unknown field name:`,
        `  ${field_name}`,
      ].join("\n") + "\n"
    )
  }

  get_type(target: Value, field_name: string): Value {
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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.NilClsValue)) {
      return Solution.failure
    }

    return solution
  }
}
