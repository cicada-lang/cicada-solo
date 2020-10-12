import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { infer_cls } from "./exp-infer-cls"
import { infer_pi } from "./exp-infer-pi"
import { infer_ap } from "./exp-infer-ap"
import { infer_fill } from "./exp-infer-fill"
import { infer_dot } from "./exp-infer-dot"
import { infer_equal } from "./exp-infer-equal"
import { infer_replace } from "./exp-infer-replace"
import { infer_absurd_ind } from "./exp-infer-absurd-ind"
import { infer_union } from "./exp-infer-union"
import { infer_begin } from "./exp-infer-begin"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") {
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      }
      return t
    }
    if (exp.kind === "Exp.pi") return infer_pi(ctx, exp)
    if (exp.kind === "Exp.ap") return infer_ap(ctx, exp)
    if (exp.kind === "Exp.cls") return infer_cls(ctx, exp)
    if (exp.kind === "Exp.fill") return infer_fill(ctx, exp)
    if (exp.kind === "Exp.obj" && exp.properties.size === 0) {
      return Value.cls([], Telescope.create(Ctx.to_env(ctx), undefined, []))
    }
    if (exp.kind === "Exp.dot") return infer_dot(ctx, exp)
    if (exp.kind === "Exp.equal") return infer_equal(ctx, exp)
    if (exp.kind === "Exp.replace") return infer_replace(ctx, exp)
    if (exp.kind === "Exp.absurd") return Value.type
    if (exp.kind === "Exp.absurd_ind") return infer_absurd_ind(ctx, exp)
    if (exp.kind === "Exp.str") return Value.type
    if (exp.kind === "Exp.quote") return Value.quote(exp.str)
    if (exp.kind === "Exp.union") return infer_union(ctx, exp)
    if (exp.kind === "Exp.type") return Value.type
    if (exp.kind === "Exp.begin") return infer_begin(ctx, exp)
    if (exp.kind === "Exp.the") {
      Exp.check(ctx, exp.t, Value.type)
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.exp, t)
      return t
    }
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
