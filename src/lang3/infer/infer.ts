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
    if (exp.inferability !== undefined) {
      return exp.inferability({ mod, ctx })
    } else {
      // TODO test coverage
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
    } else {
      throw error
    }
  }
}
