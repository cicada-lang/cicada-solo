import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function infer_type_constructor(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  datatype: Exp.type_constructor
): Value.Value {
  check_type_constructor_t(mod, ctx, datatype.t)
  for (const entry of datatype.sums) {
    check_data_constructor_t(mod, ctx, entry.t, datatype.name)
  }
  return Exp.evaluate(mod, Ctx.to_env(ctx), datatype.t)
}

function check_data_constructor_t(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Exp.Exp,
  name: string
): void {
  if (t.kind === "Exp.pi") {
    const pi = t
    Exp.check(mod, ctx, pi.arg_t, Value.type)
    check_data_constructor_t(
      mod,
      Ctx.extend(ctx, pi.name, Exp.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)),
      pi.ret_t,
      name
    )
    return
  }

  if (
    t.kind === "Exp.ap" &&
    t.target.kind === "Exp.v" &&
    t.target.name === name
  ) {
    Exp.check(mod, ctx, t, Value.type)
    return
  }

  throw new Trace.Trace("the t should be pi or ap of type constructor")
}

function check_type_constructor_t(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Exp.Exp
): void {
  if (t.kind === "Exp.pi") {
    const pi = t
    Exp.check(mod, ctx, pi.arg_t, Value.type)
    check_type_constructor_t(
      mod,
      Ctx.extend(ctx, pi.name, Exp.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)),
      pi.ret_t
    )
    return
  }

  if (t.kind === "Exp.type") {
    return
  }

  throw new Trace.Trace("the t should be pi or type")
}
