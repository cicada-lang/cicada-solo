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
  const result_ctx = check_match(mod, ctx, fn.pattern, pi.arg_t)
  if (result_ctx === undefined)
    throw new Trace.Trace(
      ut.aline(`
        |Exp.check_fn -- pattern mismatch.
        |- fn: ${Exp.repr(fn)}
        |`)
    )
  Exp.check(
    mod,
    result_ctx,
    fn.ret,
    Value.Closure.apply(
      pi.ret_t_cl,
      Value.not_yet(pi.arg_t, Neutral.v(Value.pi_arg_name(pi)))
    )
  )
}

function check_match(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pattern: Pattern.Pattern,
  t: Value.Value
): undefined | Ctx.Ctx {
  return match_pattern(mod, ctx, pattern, t, new Map())
}

// NOTE side effect on `matched`
function match_pattern(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pattern: Pattern.Pattern,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  if (pattern.kind === "Pattern.v") {
    const found = matched.get(pattern.name)
    if (found === undefined) return Ctx.extend(ctx, pattern.name, t)
    if (Value.conversion(mod, ctx, Value.type, found, t)) return ctx
    return undefined
  }

  if (pattern.kind === "Pattern.datatype" && t.kind === "Value.type") {
    // NOTE
    // - Examples:
    //   - List(T): Type
    const type_constructor = Exp.evaluate(
      mod,
      Ctx.to_env(ctx),
      Exp.v(pattern.name)
    )
    if (type_constructor.kind !== "Value.type_constructor")
      throw new Trace.Trace("expecting type_constructor")
    return match_patterns(mod, ctx, pattern.args, type_constructor.t, matched)
  }

  if (
    pattern.kind === "Pattern.data" &&
    t.kind === "Value.type_constructor" &&
    t.name === pattern.name
  ) {
    // TODO the type of type_constructor must be Value.type
    const data_constructor = Exp.do_dot(t, pattern.tag)
    if (data_constructor.kind !== "Value.data_constructor")
      throw new Trace.Trace("expecting data_constructor")
    const result_ctx = match_patterns(
      mod,
      ctx,
      pattern.args,
      data_constructor.t,
      matched
    )
    if (result_ctx === undefined) return undefined
    // NOTE
    // - We simply do a check after the `match_patterns`,
    //   the type will not be used to constrain pattern variables.
    Exp.check(mod, result_ctx, Pattern.to_exp(pattern), t)
    return result_ctx
  }

  if (
    pattern.kind === "Pattern.data" &&
    t.kind === "Value.datatype" &&
    t.type_constructor.name === pattern.name
  ) {
    // NOTE
    // - Examples:
    //   - List.null(T): List(T)
    //   - List.cons(T)(head)(tail): List(T)
    //   - Vec.null(T): Vec(T)(Nat.zero)
    //   - Vec.cons(T)(prev)(head)(tail): Vec(T)(Nat.succ(prev))
    // NOTE
    // - We will infer the type of every (nested) pattern variables.
    const data_constructor = Exp.do_dot(t.type_constructor, pattern.tag)
    if (data_constructor.kind !== "Value.data_constructor")
      throw new Trace.Trace("expecting data_constructor")
    const result_ctx = match_patterns(
      mod,
      ctx,
      pattern.args,
      data_constructor.t,
      matched
    )
    if (result_ctx === undefined) return undefined
    // NOTE
    // - We simply do a check after the `match_patterns`,
    //   the type will not be used to constrain pattern variables.
    Exp.check(mod, result_ctx, Pattern.to_exp(pattern), t)
    return result_ctx
  }

  return undefined
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
