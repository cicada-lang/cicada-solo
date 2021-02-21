import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../trace"

export function is_pi(ctx: Ctx.Ctx, value: Value.Value): Value.pi {
  if (value.kind === "Value.pi") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, { message: `I am expecting the type pi.` })
    )
  }
}

export function is_sigma(ctx: Ctx.Ctx, value: Value.Value): Value.sigma {
  if (value.kind === "Value.sigma") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type sigma.`,
      })
    )
  }
}

export function is_nat(ctx: Ctx.Ctx, value: Value.Value): Value.nat {
  if (value.kind === "Value.nat") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type nat.`,
      })
    )
  }
}

export function is_equal(ctx: Ctx.Ctx, value: Value.Value): Value.equal {
  if (value.kind === "Value.equal") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type equal.`,
      })
    )
  }
}

export function is_absurd(ctx: Ctx.Ctx, value: Value.Value): Value.absurd {
  if (value.kind === "Value.absurd") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type absurd.`,
      })
    )
  }
}

export function is_trivial(ctx: Ctx.Ctx, value: Value.Value): Value.trivial {
  if (value.kind === "Value.trivial") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type trivial.`,
      })
    )
  }
}

export function is_str(ctx: Ctx.Ctx, value: Value.Value): Value.str {
  if (value.kind === "Value.str") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type string.`,
      })
    )
  }
}
