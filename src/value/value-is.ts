import { Value } from "../value"
import { Ctx } from "../ctx"
import { Trace } from "../trace"
import { readback } from "../readback"
import { TypeValue } from "../core"
import * as ut from "../ut"

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

function unexpected(
  ctx: Ctx,
  value: Value,
  opts: { message?: string } = {}
): string {
  const exp_repr = readback(ctx, new TypeValue(), value).repr()
  return opts.message
    ? ut.aline(`
        |I see unexpected ${exp_repr}.
        |${opts.message}
        |`)
    : ut.aline(`
        |I see unexpected ${exp_repr}.
        |`)
}

export function is_pi(ctx: Ctx, value: Value): PiValue {
  if (value instanceof PiValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, { message: `I am expecting the type pi.` })
    )
  }
}

export function is_sigma(ctx: Ctx, value: Value): SigmaValue {
  if (value instanceof SigmaValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type sigma.`,
      })
    )
  }
}

export function is_nat(ctx: Ctx, value: Value): NatValue {
  if (value instanceof NatValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type nat.`,
      })
    )
  }
}

export function is_equal(ctx: Ctx, value: Value): EqualValue {
  if (value instanceof EqualValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type equal.`,
      })
    )
  }
}

export function is_absurd(ctx: Ctx, value: Value): AbsurdValue {
  if (value instanceof AbsurdValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type absurd.`,
      })
    )
  }
}

export function is_trivial(ctx: Ctx, value: Value): TrivialValue {
  if (value instanceof TrivialValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type trivial.`,
      })
    )
  }
}

export function is_str(ctx: Ctx, value: Value): StrValue {
  if (value instanceof StrValue) {
    return value
  } else {
    throw new Trace(
      unexpected(ctx, value, {
        message: `I am expecting the type string.`,
      })
    )
  }
}
