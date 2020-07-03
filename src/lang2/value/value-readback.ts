import * as Value from "../value"
import * as Closure from "../closure"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import { freshen } from "./freshen"

export function readback(ctx: Ctx.Ctx, t: Ty.Ty, value: Value.Value): Exp.Exp {
  switch (t.kind) {
    case "Value.Nat": {
      switch (value.kind) {
        case "Value.Zero": {
          return {
            kind: "Exp.Zero",
          }
        }
        case "Value.Succ": {
          return {
            kind: "Exp.Succ",
            prev: Value.readback(ctx, t, value.prev),
          }
        }
        default: {
          throw new Error("TODO")
        }
      }
    }
    case "Value.Pi": {
      // NOTE everything with a function type
      //   is immediately read back as having a Lambda on top.
      //   This implements the η-rule for functions.
      const fresh_name = freshen(new Set(ctx.keys()), t.closure.name)
      const variable: Value.Reflection = {
        kind: "Value.Reflection",
        t: t.arg_t,
        neutral: {
          kind: "Neutral.Var",
          name: fresh_name,
        },
      }
      return {
        kind: "Exp.Fn",
        name: fresh_name,
        body: Value.readback(
          Ctx.extend(ctx, fresh_name, t.arg_t),
          Closure.apply(t.closure, variable),
          Exp.do_ap(value, variable)
        ),
      }
    }
    default: {
      throw new Error("TODO")
    }
  }
}
