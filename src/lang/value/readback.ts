import { Core } from "../core"
import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import { Value } from "../value"

export function readback(ctx: Ctx, t: Value, value: Value): Core {
  // NOTE The following two `find_entry`s are like `deep_walk`
  //   (before `readback` `arg_t` in `ImApInsertion`).

  if (
    t instanceof Exps.NotYetValue &&
    t.neutral instanceof Exps.VariableNeutral
  ) {
    const entry = ctx.find_entry(t.neutral.name)
    if (entry && entry.value) {
      t = entry.value
    }
  }

  if (
    value instanceof Exps.NotYetValue &&
    value.neutral instanceof Exps.VariableNeutral
  ) {
    const entry = ctx.find_entry(value.neutral.name)
    if (entry && entry.value) {
      value = entry.value
    }
  }

  if (ReadbackEtaExpansion.based_on(t)) {
    return t.readback_eta_expansion(ctx, value)
  }

  if (
    t instanceof Exps.AbsurdValue &&
    value instanceof Exps.NotYetValue &&
    value.t instanceof Exps.AbsurdValue
  ) {
    return new Exps.TheCore(
      new Exps.BuiltInCore("Absurd"),
      value.neutral.readback_neutral(ctx)
    )
  }

  const exp = value.readback(ctx, t)

  if (exp) {
    return exp
  } else {
    const t_core = readback(ctx, new Exps.TypeValue(), t)
    throw new ExpTrace(
      [
        `I can not readback value.`,
        `  value class name: ${value.constructor.name}`,
        `  type class name: ${t.constructor.name}`,
        `  type: ${t_core.format()}`,
      ].join("\n")
    )
  }
}

export interface ReadbackEtaExpansion {
  readback_eta_expansion(ctx: Ctx, value: Value): Core
}

export const ReadbackEtaExpansion = {
  based_on(t: Value): t is Value & ReadbackEtaExpansion {
    return (t as any)["readback_eta_expansion"] instanceof Function
  },
}
