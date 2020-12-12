import * as Infer from "../infer"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer(mod: Mod.Mod, ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.pi") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.ap") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.cls") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.obj") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.dot") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.equal") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.replace") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.absurd") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.absurd_ind") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.str") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.quote") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.union") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.typecons") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.type") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.begin") return exp.inferability({ mod, ctx })
    if (exp.kind === "Exp.the") return exp.inferability({ mod, ctx })
    throw infer_error(exp)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}

function infer_error<T>(exp: Exp.Exp): Trace.Trace<T> {
  let exp_repr = exp.repr()
  exp_repr = exp_repr.replace(/\s+/g, " ")
  return new Trace.Trace(
    ut.aline(`
       |I can not infer the type of ${exp_repr}.
       |I suggest you add a type annotation to the expression.
       |`)
  )
}
