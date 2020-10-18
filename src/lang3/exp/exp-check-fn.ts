import * as Exp from "../exp"
import * as Value from "../value"
import * as Pattern from "../pattern"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function check_fn(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  fn: Exp.fn,
  pi: Value.pi
): void {
  const result_ctx = check_match(mod, ctx, fn.pattern, pi.arg_t)
  if (result_ctx === undefined) throw new Trace.Trace("pattern mismatch")
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
  return match_with(mod, ctx, pattern, t, new Map())
}

// NOTE side effect on `matched`
function match_with(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pattern: Pattern.Pattern,
  t: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Ctx.Ctx {
  switch (pattern.kind) {
    case "Pattern.v": {
      const found = matched.get(pattern.name)
      if (found === undefined)
        return Ctx.extend(ctx, pattern.name, t)
      if (Value.conversion(mod, ctx, Value.type, found, t))
        return ctx
      return undefined
    }
    case "Pattern.datatype": {
      // if (
      //   value.kind === "Value.datatype" &&
      //   value.type_constructor.name === pattern.name
      // ) {
      //   return match_args_with(env, pattern.args, value.args, matched)
      // }
      return undefined
    }
    case "Pattern.data": {
      // if (
      //   value.kind === "Value.data" &&
      //   value.data_constructor.type_constructor.name === pattern.name &&
      //   value.data_constructor.tag === pattern.tag
      // ) {
      //   return match_args_with(env, pattern.args, value.args, matched)
      // }
      return undefined
    }
  }
}
