import { Exp, ElaborationOptions } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { conversion } from "../value"
import { readback } from "../value"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"

export function check(
  ctx: Ctx,
  exp: Exp,
  t: Value,
  opts?: ElaborationOptions
): Core {
  try {
    if (exp.check) {
      return exp.check(ctx, t, opts)
    } else if (exp.infer) {
      const inferred = exp.infer(ctx, opts)
      const u = inferred.t
      if (!conversion(ctx, new Exps.TypeValue(), t, u)) {
        const u_exp = readback(ctx, new Exps.TypeValue(), u)
        const t_exp = readback(ctx, new Exps.TypeValue(), t)

        // DEBUG
        // console.log("inferred:", u_exp.repr())
        // console.dir(u, { depth: 4 })
        // console.log("expected:", t_exp.repr())
        // console.dir(t, { depth: 4 })

        throw new ExpTrace(
          [
            `I infer the type to be:`,
            `  ${u_exp.repr()}`,
            `But the expected type is:`,
            `  ${t_exp.repr()}`,
          ].join("\n")
        )
      }

      return inferred.core
    } else {
      throw new ExpTrace(
        [
          `I can not check the type of:`,
          `  ${exp.repr()}`,
          `I also can not check it by infer.`,
          `I suggest you add a type annotation to the expression.`,
        ].join("\n")
      )
    }
  } catch (error) {
    if (error instanceof ExpTrace) throw error.trail(exp)
    throw error
  }
}
