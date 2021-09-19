import { Value } from "../value"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Trace } from "../errors"
import * as ut from "../ut"
import * as Exps from "../exps"

export function readback(ctx: Ctx, t: Value, value: Value): Core {
  if (ReadbackEtaExpansion.based_on(t)) {
    return t.readback_eta_expansion(ctx, value)
  }

  if (
    t instanceof Exps.AbsurdValue &&
    value instanceof Exps.NotYetValue &&
    value.t instanceof Exps.AbsurdValue
  ) {
    return new Exps.TheCore(
      new Exps.AbsurdCore(),
      value.neutral.readback_neutral(ctx)
    )
  }

  const exp = value.readback(ctx, t)

  if (exp) return exp

  throw new Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}

export interface ReadbackEtaExpansion {
  readback_eta_expansion(ctx: Ctx, value: Value): Core
}

export const ReadbackEtaExpansion = {
  based_on(t: Value): t is Value & ReadbackEtaExpansion {
    return (t as any)["readback_eta_expansion"] instanceof Function
  },
}
