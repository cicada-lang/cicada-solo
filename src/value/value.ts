import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Trace } from "../trace"
import * as ut from "../ut"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

type Class<T> = new (...args: any[]) => T

export function match_value<A>(
  target: Value,
  branches: Array<[Class<any>, (value: any) => A]>
): A {
  for (const [theClass, f] of branches) {
    if (target instanceof theClass) {
      return f(target)
    }
  }

  throw new Trace(
    ut.aline(`
      |Value mismatch.
      |
      |I am expecting javascript classes: ${branches
        .map(([theClass]) => theClass)
        .join(", ")},
      |but in reality, the target constructor name is ${
        target.constructor.name
      }.
      |`)
  )
}
