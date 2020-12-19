import * as Check from "../check"
import { infer } from "../infer"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.fn") {
      return exp.checkability(t, { ctx })
    }
    if (exp.kind === "Exp.zero") {
      return exp.checkability(t, { ctx })
    }
    if (exp.kind === "Exp.add1") {
      return exp.checkability(t, { ctx })
    }
    if (exp.kind === "Exp.begin") {
      return exp.checkability(t, { ctx })
    }
    return check_by_infer(ctx, exp, t)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}

export function check_by_infer(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  const u = infer(ctx, exp)
  if (ut.equal(t, u)) {
    return
  }
  throw new Trace.Trace(
    ut.aline(`
      |When checking ${exp.repr()},
      |I infer the type to be ${Ty.repr(u)},
      |but the given type is ${Ty.repr(t)}.
      |`)
  )
}
