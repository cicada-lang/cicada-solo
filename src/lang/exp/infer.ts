import { Core } from "../core"
import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import { Exp } from "../exp"
import { Value } from "../value"

export function infer(ctx: Ctx, exp: Exp): { t: Value; core: Core } {
  try {
    if (exp.infer) {
      return exp.infer(ctx)
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
