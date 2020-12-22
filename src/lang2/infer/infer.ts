import * as Infer from "../infer"
import * as Explain from "../explain"
import * as Evaluate from "../evaluate"
import * as Check from "../check"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { do_car } from "../exps/car"
import { do_ap } from "../exps/ap"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.pi") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.sigma") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.ap") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.car") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.cdr") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.nat") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.zero") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.add1") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.nat_ind") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.equal") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.replace") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.trivial") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.sole") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.absurd") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.absurd_ind") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.str") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.quote") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.type") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.begin") {
      return exp.inferability({ ctx })
    } else if (exp.kind === "Exp.the") {
      return exp.inferability({ ctx })
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of ${exp.repr()}.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
