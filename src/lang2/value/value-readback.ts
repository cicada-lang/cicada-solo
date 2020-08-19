import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import { freshen } from "./freshen"
import * as ut from "../../ut"

export function readback(ctx: Ctx.Ctx, t: Ty.Ty, value: Value.Value): Exp.Exp {
  if (t.kind === "Value.nat" && value.kind === "Value.zero") {
    return { kind: "Exp.zero" }
  } else if (t.kind === "Value.nat" && value.kind === "Value.add1") {
    return { kind: "Exp.add1", prev: Value.readback(ctx, t, value.prev) }
  } else if (t.kind === "Value.pi") {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = freshen(new Set(ctx.keys()), t.closure.name)
    const variable: Value.reflection = {
      kind: "Value.reflection",
      t: t.arg_t,
      neutral: { kind: "Neutral.v", name: fresh_name },
    }
    return {
      kind: "Exp.fn",
      name: fresh_name,
      body: Value.readback(
        Ctx.extend(Ctx.clone(ctx), fresh_name, t.arg_t),
        Closure.apply(t.closure, variable),
        Exp.do_ap(value, variable)
      ),
    }
  } else if (t.kind === "Value.sigma") {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = Exp.do_car(value)
    const cdr = Exp.do_cdr(value)
    return {
      kind: "Exp.cons",
      car: Value.readback(ctx, t.car_t, car),
      cdr: Value.readback(ctx, Closure.apply(t.closure, car), cdr),
    }
  } else if (t.kind === "Value.trivial") {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return { kind: "Exp.sole" }
  } else if (
    t.kind === "Value.absurd" &&
    value.kind === "Value.reflection" &&
    value.t.kind === "Value.absurd"
  ) {
    return {
      kind: "Exp.the",
      t: { kind: "Exp.absurd" },
      exp: Neutral.readback(ctx, value.neutral),
    }
  } else if (t.kind === "Value.equal" && value.kind === "Value.same") {
    return { kind: "Exp.same" }
  } else if (t.kind === "Value.str" && value.kind === "Value.quote") {
    return { kind: "Exp.quote", str: value.str }
  } else if (t.kind === "Value.type" && value.kind === "Value.nat") {
    return { kind: "Exp.nat" }
  } else if (t.kind === "Value.type" && value.kind === "Value.str") {
    return { kind: "Exp.str" }
  } else if (t.kind === "Value.type" && value.kind === "Value.trivial") {
    return { kind: "Exp.trivial" }
  } else if (t.kind === "Value.type" && value.kind === "Value.absurd") {
    return { kind: "Exp.absurd" }
  } else if (t.kind === "Value.type" && value.kind === "Value.equal") {
    return {
      kind: "Exp.equal",
      t: Value.readback(ctx, { kind: "Value.type" }, value.t),
      from: Value.readback(ctx, value.t, value.from),
      to: Value.readback(ctx, value.t, value.to),
    }
  } else if (t.kind === "Value.type" && value.kind === "Value.sigma") {
    const fresh_name = freshen(new Set(ctx.keys()), value.closure.name)
    const variable: Value.reflection = {
      kind: "Value.reflection",
      t: value.car_t,
      neutral: { kind: "Neutral.v", name: fresh_name },
    }
    const car_t = Value.readback(ctx, { kind: "Value.type" }, value.car_t)
    const cdr_t = Value.readback(
      Ctx.extend(Ctx.clone(ctx), fresh_name, value.car_t),
      { kind: "Value.type" },
      Closure.apply(value.closure, variable)
    )
    return { kind: "Exp.sigma", name: fresh_name, car_t, cdr_t }
  } else if (t.kind === "Value.type" && value.kind === "Value.pi") {
    const fresh_name = freshen(new Set(ctx.keys()), value.closure.name)
    const variable: Value.reflection = {
      kind: "Value.reflection",
      t: value.arg_t,
      neutral: { kind: "Neutral.v", name: fresh_name },
    }
    const arg_t = Value.readback(ctx, { kind: "Value.type" }, value.arg_t)
    const ret_t = Value.readback(
      Ctx.extend(Ctx.clone(ctx), fresh_name, value.arg_t),
      { kind: "Value.type" },
      Closure.apply(value.closure, variable)
    )
    return { kind: "Exp.pi", name: fresh_name, arg_t, ret_t }
  } else if (t.kind === "Value.type" && value.kind === "Value.type") {
    return { kind: "Exp.type" }
  } else if (value.kind === "Value.reflection") {
    // NOTE  t and value.t are ignored here,
    //  maybe use them to debug.
    return Neutral.readback(ctx, value.neutral)
  } else {
    throw new Error(
      ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
    )
  }
}
