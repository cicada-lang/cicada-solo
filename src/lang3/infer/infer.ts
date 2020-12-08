import * as Infer from "../infer"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { infer_v } from "./infer-v"
import { infer_cls } from "./infer-cls"
import { infer_pi } from "./infer-pi"
import { infer_ap } from "./infer-ap"
import { infer_dot } from "./infer-dot"
import { infer_equal } from "./infer-equal"
import { infer_replace } from "./infer-replace"
import { infer_absurd_ind } from "./infer-absurd-ind"
import { infer_union } from "./infer-union"
import { infer_typecons } from "./infer-typecons"
import { infer_begin } from "./infer-begin"
import { infer_the } from "./infer-the"

export function infer(mod: Mod.Mod, ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") return infer_v(mod, ctx, exp)
    if (exp.kind === "Exp.pi") return infer_pi(mod, ctx, exp)
    if (exp.kind === "Exp.ap") return infer_ap(mod, ctx, exp)
    if (exp.kind === "Exp.cls") return infer_cls(mod, ctx, exp)
    if (exp.kind === "Exp.obj" && exp.properties.size === 0)
      return Value.cls(
        [],
        Value.Telescope.create(mod, Ctx.to_env(ctx), undefined, [])
      )
    if (exp.kind === "Exp.dot") return infer_dot(mod, ctx, exp)
    if (exp.kind === "Exp.equal") return infer_equal(mod, ctx, exp)
    if (exp.kind === "Exp.replace") return infer_replace(mod, ctx, exp)
    if (exp.kind === "Exp.absurd") return Value.type
    if (exp.kind === "Exp.absurd_ind") return infer_absurd_ind(mod, ctx, exp)
    if (exp.kind === "Exp.str") return Value.type
    if (exp.kind === "Exp.quote") return Value.quote(exp.str)
    if (exp.kind === "Exp.union") return infer_union(mod, ctx, exp)
    if (exp.kind === "Exp.typecons") return infer_typecons(mod, ctx, exp)
    if (exp.kind === "Exp.type") return Value.type
    if (exp.kind === "Exp.begin") return infer_begin(mod, ctx, exp)
    if (exp.kind === "Exp.the") return infer_the(mod, ctx, exp)
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
  let exp_repr = Exp.repr(exp)
  exp_repr = exp_repr.replace(/\s+/g, " ")
  return new Trace.Trace(
    ut.aline(`
       |I can not infer the type of ${exp_repr}.
       |I suggest you add a type annotation to the expression.
       |`)
  )
}
