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

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") {
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      }
      return t
    } else if (exp.kind === "Exp.pi") {
      return infer_pi(ctx, exp)
    } else if (exp.kind === "Exp.ap") {
      return infer_ap(ctx, exp)
    } else if (exp.kind === "Exp.cls") {
      return infer_cls(ctx, exp)
    } else if (exp.kind === "Exp.fill") {
      return infer_fill(ctx, exp)
    } else if (exp.kind === "Exp.obj" && exp.properties.size === 0) {
      return Value.cls([], Telescope.create(Ctx.to_env(ctx), undefined, []))
    } else if (exp.kind === "Exp.dot") {
      return infer_dot(ctx, exp)
    } else if (exp.kind === "Exp.equal") {
      return infer_equal(ctx, exp)
    } else if (exp.kind === "Exp.replace") {
      return infer_replace(ctx, exp)
    } else if (exp.kind === "Exp.absurd") {
      return Value.type
    } else if (exp.kind === "Exp.absurd_ind") {
      return infer_absurd_ind(ctx, exp)
    } else if (exp.kind === "Exp.str") {
      return Value.type
    } else if (exp.kind === "Exp.quote") {
      return Value.quote(exp.str)
    } else if (exp.kind === "Exp.union") {
      const { left, right } = exp
      Exp.check(ctx, left, Value.type)
      Exp.check(ctx, right, Value.type)
      return Value.type
    } else if (exp.kind === "Exp.type") {
      return Value.type
    } else if (exp.kind === "Exp.begin") {
      const { stmts, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(ctx, stmt)
      }
      return Exp.infer(ctx, ret)
    } else if (exp.kind === "Exp.the") {
      Exp.check(ctx, exp.t, Value.type)
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.exp, t)
      return t
    } else {
      let exp_repr = Exp.repr(exp)
      exp_repr = exp_repr.replace(/\s+/g, " ")
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of ${exp_repr}.
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
