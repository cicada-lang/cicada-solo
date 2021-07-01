import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { conversion } from "../value"
import { readback } from "../value"
import { Trace } from "../errors"
import * as ut from "../ut"
import * as Sem from "../sem"

export function check(ctx: Ctx, exp: Exp, t: Value): Core {
  try {
    if (exp.check) {
      return exp.check(ctx, t)
    } else if (exp.infer) {
      const inferred = exp.infer(ctx)
      const u = inferred.t
      if (!conversion(ctx, new Sem.TypeValue(), t, u)) {
        const u_exp = readback(ctx, new Sem.TypeValue(), u)
        const t_exp = readback(ctx, new Sem.TypeValue(), t)

        throw new Trace(
          ut.aline(`
            |I infer the type to be:
            |  ${u_exp.repr()}
            |But the expected type is:
            |  ${t_exp.repr()}
            |`)
        )
      }

      return inferred.core
    } else {
      throw new Trace(
        ut.aline(`
          |I can not check the type of:
          |  ${exp.repr()}
          |I also can not check it by infer.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    }
  } catch (error) {
    if (error instanceof Trace) throw error.trail(exp)
    throw error
  }
}
