import { Var } from "../var"
import { evaluator } from "../../evaluator"
import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Check from "../../check"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Ctx from "../../ctx"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"
import { fn_evaluable } from "./fn-evaluable"

export type Fn = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.fn"
    pattern: Pattern.Pattern
    ret: Exp
  }

export function Fn(pattern: Pattern.Pattern, ret: Exp): Fn {
  const repr = () => `(${Pattern.repr(pattern)}) => ${ret.repr()}`

  const checkable: Checkable = {
    checkability: (t, { mod, ctx }) => {
      const pi = Value.is_pi(mod, ctx, t)
      const result_ctx = match_pattern(mod, ctx, pattern, pi.arg_t, new Map())
      if (result_ctx === undefined)
        throw new Trace.Trace(
          ut.aline(`
|Check.check_fn -- pattern mismatch.
|- fn: ${repr()}
|`)
        )
      const arg = evaluator.evaluate(Pattern.to_exp(pattern), {
        mod,
        env: Ctx.to_env(result_ctx),
      })
      // NOTE Before we introduced `Pattern`, the following `arg` is used:
      //   const arg = Value.not_yet(pi.arg_t, Neutral.v(Value.pi_arg_name(pi)))
      Check.check(mod, result_ctx, ret, Value.Closure.apply(pi.ret_t_cl, arg))
    },
  }

  return {
    kind: "Exp.fn",
    pattern,
    ret,
    ...fn_evaluable(pattern, ret),
    ...checkable,
    repr,
  }
}

function match_pattern(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pattern: Pattern.Pattern,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  if (pattern.kind === "Pattern.v")
    return match_v(mod, ctx, pattern, t, matched)

  if (pattern.kind === "Pattern.datatype" && t.kind === "Value.type")
    return match_datatype(mod, ctx, pattern, matched)

  if (
    pattern.kind === "Pattern.data" &&
      t.kind === "Value.typecons" &&
      t.name === pattern.name
  )
    // TODO Why we can not normalize `typecons` to `datatype`?
    return match_data(mod, ctx, pattern, t, t, matched)

  if (
    pattern.kind === "Pattern.data" &&
      t.kind === "Value.datatype" &&
      t.typecons.name === pattern.name
  )
    return match_data(mod, ctx, pattern, t.typecons, t, matched)

  return undefined
}

function match_v(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  v: Pattern.v,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  const found = matched.get(v.name)
  if (found === undefined) return Ctx.extend(ctx, v.name, t)
  if (Value.conversion(mod, ctx, Value.type, found, t)) return ctx
  return undefined
}

function match_datatype(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  datatype: Pattern.datatype,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  // NOTE
  // - Examples:
  //   - List(T): Type
  const typecons = evaluator.evaluate(Var(datatype.name), {
    mod,
    env: Ctx.to_env(ctx),
  })
  if (typecons.kind !== "Value.typecons")
    throw new Trace.Trace("expecting typecons")
  return match_patterns(mod, ctx, datatype.args, typecons.t, matched)
}

function match_data(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  data: Pattern.data,
  typecons: Value.typecons,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  // NOTE
  // - Examples:
  //   - List.null(T): List(T)
  //   - List.cons(T)(head)(tail): List(T)
  //   - Vec.null(T): Vec(T)(Nat.zero)
  //   - Vec.cons(T)(prev)(head)(tail): Vec(T)(Nat.succ(prev))
  // NOTE
  // - We will infer the type of every (nested) pattern variables.
  const datacons = Evaluate.do_dot(typecons, data.tag)
  if (datacons.kind !== "Value.datacons")
    throw new Trace.Trace("expecting datacons")
  const result_ctx = match_patterns(mod, ctx, data.args, datacons.t, matched)
  if (result_ctx === undefined) return undefined
  // NOTE
  // - We simply do a check after the `match_patterns`,
  //   the type will not be used to constrain pattern variables.
  Check.check(mod, result_ctx, Pattern.to_exp(data), t)
  return result_ctx
}

// NOTE side effect on `matched`
function match_patterns(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  patterns: Array<Pattern.Pattern>,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  if (patterns.length === 0) return ctx
  let result_ctx: undefined | Ctx.Ctx = ctx
  for (const pattern of patterns) {
    if (t.kind !== "Value.pi") return undefined
    result_ctx = match_pattern(mod, result_ctx, pattern, t.arg_t, matched)
    if (result_ctx === undefined) return undefined
    t = Value.Closure.apply(
      t.ret_t_cl,
      evaluator.evaluate(Pattern.to_exp(pattern), {
        mod,
        env: Ctx.to_env(result_ctx),
      })
    )
  }
  return result_ctx
}
