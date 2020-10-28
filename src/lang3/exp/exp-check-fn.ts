import * as Exp from "../exp"
import * as Value from "../value"
import * as Pattern from "../pattern"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_fn(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  fn: Exp.fn,
  pi: Value.pi
): void {
  const result_ctx = match_pattern(mod, ctx, fn.pattern, pi.arg_t, new Map())
  if (result_ctx === undefined)
    throw new Trace.Trace(
      ut.aline(`
        |Exp.check_fn -- pattern mismatch.
        |- fn: ${Exp.repr(fn)}
        |`)
    )
  const arg = Exp.evaluate(mod, Ctx.to_env(result_ctx), Pattern.to_exp(fn.pattern))
  // NOTE before we introduced `Pattern`, the following `arg` is used:
  //   const arg = Value.not_yet(pi.arg_t, Neutral.v(Value.pi_arg_name(pi)))
  Exp.check(mod, result_ctx, fn.ret, Value.Closure.apply(pi.ret_t_cl, arg))
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
    t.kind === "Value.type_constructor" &&
    t.name === pattern.name
  )
    // TODO Why we can not normalize `type_constructor` to `datatype`?
    return match_data(mod, ctx, pattern, t, t, matched)

  if (
    pattern.kind === "Pattern.data" &&
    t.kind === "Value.datatype" &&
    t.type_constructor.name === pattern.name
  )
    return match_data(mod, ctx, pattern, t.type_constructor, t, matched)

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
  const type_constructor = Exp.evaluate(
    mod,
    Ctx.to_env(ctx),
    Exp.v(datatype.name)
  )
  if (type_constructor.kind !== "Value.type_constructor")
    throw new Trace.Trace("expecting type_constructor")
  return match_patterns(mod, ctx, datatype.args, type_constructor.t, matched)
}

function match_data(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  data: Pattern.data,
  type_constructor: Value.type_constructor,
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
  const data_constructor = Exp.do_dot(type_constructor, data.tag)
  if (data_constructor.kind !== "Value.data_constructor")
    throw new Trace.Trace("expecting data_constructor")
  const result_ctx = match_patterns(
    mod,
    ctx,
    data.args,
    data_constructor.t,
    matched
  )
  if (result_ctx === undefined) return undefined
  // NOTE
  // - We simply do a check after the `match_patterns`,
  //   the type will not be used to constrain pattern variables.
  Exp.check(mod, result_ctx, Pattern.to_exp(data), t)
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
      Exp.evaluate(mod, Ctx.to_env(result_ctx), Pattern.to_exp(pattern))
    )
  }
  return result_ctx
}
