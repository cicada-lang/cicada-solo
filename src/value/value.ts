import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Core } from "../core"
import { Trace } from "../trace"
import * as ut from "../ut"

export abstract class Value {
  instanceofValue = true

  abstract readback(ctx: Ctx, t: Value): Core | undefined
  eta_expand?(ctx: Ctx, value: Value): Core
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

  const classes = branches.map(([theClass]) => theClass.name).join(", ")

  throw new Trace(
    ut.aline(`
      |Value mismatch.
      |
      |I am expecting javascript classes: ${classes},
      |but in reality, the target class name is ${target.constructor.name}.
      |`)
  )
}
