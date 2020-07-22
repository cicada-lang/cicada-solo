import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import { freshen } from "./freshen"
import * as ut from "../../ut"

export function readback(ctx: Ctx.Ctx, t: Ty.Ty, value: Value.Value): Exp.Exp {
  if (t.kind === "Value.Nat" && value.kind === "Value.Zero") {
    return { kind: "Exp.Zero" }
  } else if (t.kind === "Value.Nat" && value.kind === "Value.Add1") {
    return { kind: "Exp.Add1", prev: Value.readback(ctx, t, value.prev) }
  } else if (t.kind === "Value.Pi") {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = freshen(new Set(ctx.keys()), t.closure.name)
    const variable: Value.Reflection = {
      kind: "Value.Reflection",
      t: t.arg_t,
      neutral: { kind: "Neutral.Var", name: fresh_name },
    }
    return {
      kind: "Exp.Fn",
      name: fresh_name,
      body: Value.readback(
        Ctx.extend(Ctx.clone(ctx), fresh_name, t.arg_t),
        Closure.apply(t.closure, variable),
        Exp.do_ap(value, variable)
      ),
    }
  } else if (t.kind === "Value.Sigma") {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with Cons at the top.
    const car = Exp.do_car(value)
    const cdr = Exp.do_cdr(value)
    return {
      kind: "Exp.Cons",
      car: Value.readback(ctx, t.car_t, car),
      cdr: Value.readback(ctx, Closure.apply(t.closure, car), cdr),
    }
  } else if (t.kind === "Value.Trivial") {
    // NOTE The η-rule for Trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return { kind: "Exp.Sole" }
  } else if (
    t.kind === "Value.Absurd" &&
    value.kind === "Value.Reflection" &&
    value.t.kind === "Value.Absurd"
  ) {
    return {
      kind: "Exp.The",
      t: { kind: "Exp.Absurd" },
      exp: Neutral.readback(ctx, value.neutral),
    }
  } else if (t.kind === "Value.Equal" && value.kind === "Value.Same") {
    return { kind: "Exp.Same" }
  } else if (t.kind === "Value.Str" && value.kind === "Value.Quote") {
    return { kind: "Exp.Quote", str: value.str }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Nat") {
    return { kind: "Exp.Nat" }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Str") {
    return { kind: "Exp.Str" }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Trivial") {
    return { kind: "Exp.Trivial" }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Absurd") {
    return { kind: "Exp.Absurd" }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Equal") {
    return {
      kind: "Exp.Equal",
      t: Value.readback(ctx, { kind: "Value.Type" }, value.t),
      from: Value.readback(ctx, value.t, value.from),
      to: Value.readback(ctx, value.t, value.to),
    }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Sigma") {
    const fresh_name = freshen(new Set(ctx.keys()), value.closure.name)
    const variable: Value.Reflection = {
      kind: "Value.Reflection",
      t: value.car_t,
      neutral: { kind: "Neutral.Var", name: fresh_name },
    }
    const car_t = Value.readback(ctx, { kind: "Value.Type" }, value.car_t)
    const cdr_t = Value.readback(
      Ctx.extend(Ctx.clone(ctx), fresh_name, value.car_t),
      { kind: "Value.Type" },
      Closure.apply(value.closure, variable)
    )
    return { kind: "Exp.Sigma", name: fresh_name, car_t, cdr_t }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Pi") {
    const fresh_name = freshen(new Set(ctx.keys()), value.closure.name)
    const variable: Value.Reflection = {
      kind: "Value.Reflection",
      t: value.arg_t,
      neutral: { kind: "Neutral.Var", name: fresh_name },
    }
    const arg_t = Value.readback(ctx, { kind: "Value.Type" }, value.arg_t)
    const ret_t = Value.readback(
      Ctx.extend(Ctx.clone(ctx), fresh_name, value.arg_t),
      { kind: "Value.Type" },
      Closure.apply(value.closure, variable)
    )
    return { kind: "Exp.Pi", name: fresh_name, arg_t, ret_t }
  } else if (t.kind === "Value.Type" && value.kind === "Value.Type") {
    return { kind: "Exp.Type" }
  } else if (value.kind === "Value.Reflection") {
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
