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
      return check_by_infer(ctx, exp as ExpWithInfer, t, opts)
    } else {
      throw new ExpTrace(
        [
          `I can not check the type of:`,
          `  ${exp.format()}`,
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

type ExpWithInfer = Exp & {
  infer(ctx: Ctx, opts?: ElaborationOptions): { t: Value; core: Core }
}

export function check_by_infer(
  ctx: Ctx,
  exp: ExpWithInfer,
  t: Value,
  opts?: ElaborationOptions
): Core {
  const inferred = exp.infer(ctx, opts)
  const u = inferred.t
  if (!conversion(ctx, new Exps.TypeValue(), t, u)) {
    const u_exp = readback(ctx, new Exps.TypeValue(), u)
    const t_exp = readback(ctx, new Exps.TypeValue(), t)

    // { // DEBUG
    //   console.log("inferred:", u_exp.format())
    //   console.dir(u, { depth: 4 })
    //   console.log("expected:", t_exp.format())
    //   console.dir(t, { depth: 4 })
    // }

    throw new ExpTrace(
      [
        `I infer the type to be:`,
        `  ${u_exp.format()}`,
        `But the expected type is:`,
        `  ${t_exp.format()}`,
      ].join("\n")
    )
  }

  return inferred.core
}
