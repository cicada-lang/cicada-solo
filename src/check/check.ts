import { Exp } from "../exp"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { TypeValue } from "../exps"
import { conversion } from "../conversion"
import { readback } from "../readback"
import { Trace } from "../trace"
import * as ut from "../ut"

export function check(ctx: Ctx, exp: Exp, t: Value): void {
  try {
    if (exp.check) {
      return exp.check(ctx, t)
    } else if (exp.infer) {
      const u = exp.infer(ctx)
      if (!conversion(ctx, new TypeValue(), t, u)) {
        const u_exp = readback(ctx, new TypeValue(), u)
        const t_exp = readback(ctx, new TypeValue(), t)
        throw new Trace(
          ut.aline(`
            |I infer the type to be ${u_exp.repr()}.
            |But the given type is ${t_exp.repr()}.
            |`)
        )
      }
    } else {
      throw new Trace(
        ut.aline(`
          |I can not check the type of ${exp.repr()}.
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
