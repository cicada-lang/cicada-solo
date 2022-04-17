import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Exp } from "../exp"
import { Value } from "../value"

export function infer(ctx: Ctx, exp: Exp): { t: Value; core: Core } {
  try {
    if (exp.infer) {
      return exp.infer(ctx)
    }

    throw new ElaborationError(
      [
        `I can not infer the type of ${exp.format()}.`,
        `I suggest you add a type annotation to the expression.`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof ElaborationError) throw error.trail(exp)
    throw error
  }
}
