import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

export function match_value<B>(
  target: Value,
  branches: { [key: string]: (value: any) => B }
): B {
  for (const [name, f] of Object.entries(branches)) {
    if (name === target.constructor.name) {
      return f(target)
    }
  }

  throw new Trace(
    ut.aline(`
      |Value mismatch.
      |
      |I am expecting: ${Object.keys(branches).join(", ")},
      |but in reality, the target type is ${target.constructor.name}.
      |`)
  )
}
