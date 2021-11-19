import { Exp, ElaborationOptions } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"

export function infer(
  ctx: Ctx,
  exp: Exp,
  opts?: ElaborationOptions
): { t: Value; core: Core } {
  try {
    if (exp.infer) {
      return exp.infer(ctx, opts)
    }

    throw new ExpTrace(
      [
        `I can not infer the type of ${exp.format()}.`,
        `I suggest you add a type annotation to the expression.`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof ExpTrace) throw error.trail(exp)
    throw error
  }
}
