import * as Readback from "../../readback"
import * as Value from "../../value"
import * as Closure from "../../value/closure"
import * as Neutral from "../../neutral"
import * as Exp from "../../exp"
import * as Ctx from "../../ctx"
import * as Mod from "../../mod"
import * as ut from "../../../ut"
import { Readbackable, ReadbackAsType } from "../../readbackable"

export function pi_readbackable(
  arg_t: Value.Value,
  ret_t_cl: Closure.Closure
): Readbackable {
  return ReadbackAsType({
    readback_as_type: ({ mod, ctx }) => {
      const fresh_name = ut.freshen_name(
        new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
        Value.pi_arg_name(Value.pi(arg_t, ret_t_cl))
      )
      const variable = Value.not_yet(arg_t, Neutral.v(fresh_name))
      return Exp.pi(
        fresh_name,
        Readback.readback(mod, ctx, Value.type, arg_t),
        Readback.readback(
          mod,
          Ctx.extend(ctx, fresh_name, arg_t),
          Value.type,
          Value.Closure.apply(ret_t_cl, variable)
        )
      )
    },
  })
}
