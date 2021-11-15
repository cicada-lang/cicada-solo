import { Ctx } from "../ctx"
import { Core } from "../core"
import { Solution } from "../solution"

export abstract class Value {
  abstract readback(ctx: Ctx, t: Value): Core | undefined

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error(
      [
        `Method not implemented: Value.unify`,
        `  class name: ${this.constructor.name}`,
      ].join("\n")
    )
  }
}
