import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { conversion } from "../value"
import { readback } from "../value"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import * as ut from "../../ut"
import { VagueFnCore } from "../exps"

export function check(ctx: Ctx, exp: Exp, t: Value): Core {
  try {
    // NOTE Different from implicit-fn insertion,
    //   which is handled in `Fn.check`,
    //   vague-fn insertion is handle here,
    //   because the underlying expression might not be a `Fn`.
    if (t instanceof Exps.VaguePiValue && !(exp instanceof Exps.VagueFn)) {
      return t.vague_inserter.insert_vague_fn(ctx, exp)
    }

    if (exp.check) {
      return exp.check(ctx, t)
    } else if (exp.infer) {
      return check_by_infer(ctx, exp as ExpWithInfer, t)
    } else {
      throw new ExpTrace(
        [
          `I can not check the type of:`,
          `${ut.indent(exp.format(), "  ")}`,
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
  infer(ctx: Ctx): { t: Value; core: Core }
}

export function check_by_infer(ctx: Ctx, exp: ExpWithInfer, t: Value): Core {
  const inferred = exp.infer(ctx)
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
        `${ut.indent(u_exp.format(), "  ")}`,
        `But the expected type is:`,
        `${ut.indent(t_exp.format(), "  ")}`,
      ].join("\n")
    )
  }

  return inferred.core
}
