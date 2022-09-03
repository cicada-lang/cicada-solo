import { Core } from "../core"
import { Ctx } from "../ctx"
import { Solution } from "../solution"

export abstract class Neutral {
  abstract readback_neutral(ctx: Ctx): Core

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    throw new Error(
      [
        `Method not implemented for Neutral.`,
        `  method name: unify`,
        `  class name: ${this.constructor.name}`,
      ].join("\n"),
    )
  }
}
