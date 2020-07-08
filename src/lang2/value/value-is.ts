import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"

export function isPi(ctx: Ctx.Ctx, value: Value.Value): Value.Pi {
  if (value.kind === "Value.Pi") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, { message: `I am expecting the Type Pi.` })
    )
  }
}

export function isSigma(ctx: Ctx.Ctx, value: Value.Value): Value.Sigma {
  if (value.kind === "Value.Sigma") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type Sigma.`,
      })
    )
  }
}

export function isNat(ctx: Ctx.Ctx, value: Value.Value): Value.Nat {
  if (value.kind === "Value.Nat") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type Nat.`,
      })
    )
  }
}

export function isEqual(ctx: Ctx.Ctx, value: Value.Value): Value.Equal {
  if (value.kind === "Value.Equal") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type Equal.`,
      })
    )
  }
}

export function isAbsurd(ctx: Ctx.Ctx, value: Value.Value): Value.Absurd {
  if (value.kind === "Value.Absurd") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type Absurd.`,
      })
    )
  }
}

export function isTrivial(ctx: Ctx.Ctx, value: Value.Value): Value.Trivial {
  if (value.kind === "Value.Trivial") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type Trivial.`,
      })
    )
  }
}

export function isStr(ctx: Ctx.Ctx, value: Value.Value): Value.Str {
  if (value.kind === "Value.Str") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the Type String.`,
      })
    )
  }
}
