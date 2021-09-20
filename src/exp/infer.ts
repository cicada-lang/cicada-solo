import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { Trace } from "../errors"
import * as ut from "../ut"

export function infer(ctx: Ctx, exp: Exp): { t: Value; core: Core } {
  try {
    if (exp.infer) {
      return exp.infer(ctx)
    }

    throw new Trace(
      [
        `I can not infer the type of ${exp.repr()}.`,
        `I suggest you add a type annotation to the expression.`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof Trace) throw error.trail(exp)
    throw error
  }
}
