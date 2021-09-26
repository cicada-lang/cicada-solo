import { Ctx } from "../ctx"
import { Core } from "../core"
import { Solution } from "../solution"

export abstract class Value {
  abstract readback(ctx: Ctx, t: Value): Core | undefined

  unify(solution: Solution, that: Value): Solution {
    throw new Error(
      [
        `Method not implemented: Value.unify`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }

  // NOTE take `ctx` for `readback`
  deep_walk(ctx: Ctx, solution: Solution): Value {
    throw new Error(
      [
        `Method not implemented: Value.deep_walk`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }
}
