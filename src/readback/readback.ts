import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as ut from "../ut"
import { do_car } from "../core/car"
import { do_cdr } from "../core/cdr"
import { do_ap } from "../core/ap"
import { Var } from "../core"
import { Pi, Fn } from "../core"
import { Sigma, Cons } from "../core"
import { Nat, Zero, Add1 } from "../core"
import { Equal, Same } from "../core"
import { Absurd } from "../core"
import { Trivial, Sole } from "../core"
import { Str, Quote } from "../core"
import { Type } from "../core"
import { Let } from "../core"
import { The } from "../core"
import { PiValue } from "../core/pi-value"
import { SigmaValue } from "../core/sigma-value"
import { AbsurdValue } from "../core/absurd-value"
import { TrivialValue } from "../core/trivial-value"
import { NotYetValue } from "../core/not-yet-value"

export function readback(
  ctx: Ctx.Ctx,
  t: Value.Value,
  value: Value.Value
): Exp.Exp {
  if (t.eta_expand) {
    return t.eta_expand(ctx, value)
  }

  if (t instanceof SigmaValue) {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = do_car(value)
    const cdr = do_cdr(value)
    return new Cons(
      Readback.readback(ctx, t.car_t, car),
      Readback.readback(ctx, Value.Closure.apply(t.cdr_t_cl, car), cdr)
    )
  }

  if (t instanceof TrivialValue) {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Sole()
  }

  if (
    t instanceof AbsurdValue &&
    value instanceof NotYetValue &&
    value.t instanceof AbsurdValue
  ) {
    return new The(new Absurd(), Readback.readback_neutral(ctx, value.neutral))
  }

  const exp = value.readback(ctx, t)

  if (exp !== undefined) {
    return exp
  }

  throw new Error(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}
