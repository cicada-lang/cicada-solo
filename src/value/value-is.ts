import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../trace"

import { TypeValue } from "../core/type-value"
import { AbsurdValue } from "../core/absurd-value"
import { PiValue } from "../core/pi-value"
import { TrivialValue } from "../core/trivial-value"
import { SoleValue } from "../core/sole-value"
import { EqualValue } from "../core/equal-value"
import { StrValue } from "../core/str-value"
import { NatValue } from "../core/nat-value"
import { SigmaValue } from "../core/sigma-value"
import { SameValue } from "../core/same-value"
import { ZeroValue } from "../core/zero-value"
import { Add1Value } from "../core/add1-value"
import { QuoteValue } from "../core/quote-value"
import { ConsValue } from "../core/cons-value"
import { FnValue } from "../core/fn-value"
import { NotYetValue } from "../core/not-yet-value"

export function is_pi(ctx: Ctx.Ctx, value: Value.Value): Value.pi {
  if (value instanceof PiValue) {
    return value as Value.pi
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, { message: `I am expecting the type pi.` })
    )
  }
}

export function is_sigma(ctx: Ctx.Ctx, value: Value.Value): Value.sigma {
  if (value instanceof SigmaValue) {
    return value as Value.sigma
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type sigma.`,
      })
    )
  }
}

export function is_nat(ctx: Ctx.Ctx, value: Value.Value): NatValue {
  if (value instanceof NatValue) {
    return value as NatValue
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type nat.`,
      })
    )
  }
}

export function is_equal(ctx: Ctx.Ctx, value: Value.Value): EqualValue {
  if (value instanceof EqualValue) {
    return value as EqualValue
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type equal.`,
      })
    )
  }
}

export function is_absurd(ctx: Ctx.Ctx, value: Value.Value): AbsurdValue {
  if (value instanceof AbsurdValue) {
    return value as AbsurdValue
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type absurd.`,
      })
    )
  }
}

export function is_trivial(ctx: Ctx.Ctx, value: Value.Value): TrivialValue {
  if (value instanceof TrivialValue) {
    return value as TrivialValue
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type trivial.`,
      })
    )
  }
}

export function is_str(ctx: Ctx.Ctx, value: Value.Value): StrValue {
  if (value instanceof StrValue) {
    return value as StrValue
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, {
        message: `I am expecting the type string.`,
      })
    )
  }
}
