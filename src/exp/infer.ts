import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import * as ut from "../ut"

export function infer(ctx: Ctx, exp: Exp): { t: Value; core: Core } {
  try {
    if (exp.infer) {
      return exp.infer(ctx)
    }

    throw new ExpTrace(
      [
        `I can not infer the type of ${exp.repr()}.`,
        `I suggest you add a type annotation to the expression.`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof ExpTrace) throw error.trail(exp)
    throw error
  }
}
