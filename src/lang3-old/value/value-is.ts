import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function is_pi(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.pi {
  if (value.kind === "Value.pi") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type pi.`,
      })
    )
  }
}

export function is_cls(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.cls {
  if (value.kind === "Value.cls") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type cls.`,
      })
    )
  }
}

export function is_datatype(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.type_constructor {
  if (value.kind === "Value.type_constructor") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type datatype.`,
      })
    )
  }
}

export function is_equal(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.equal {
  if (value.kind === "Value.equal") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type equal.`,
      })
    )
  }
}

export function is_absurd(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.absurd {
  if (value.kind === "Value.absurd") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type absurd.`,
      })
    )
  }
}

export function is_str(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Value.str {
  if (value.kind === "Value.str") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(mod, ctx, value, {
        message: `I am expecting the type string.`,
      })
    )
  }
}
