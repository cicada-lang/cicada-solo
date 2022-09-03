import { Core } from "../core"
import { Ctx } from "../ctx"
import { DotHandler } from "../exps/cls/dot-handler"
import { ApHandler } from "../exps/pi/ap-handler"
import { Solution } from "../solution"

export abstract class Value {
  abstract readback(ctx: Ctx, t: Value): Core | undefined

  ap_handler?: ApHandler
  dot_handler?: DotHandler

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error(
      [
        `Method not implemented: Value.unify`,
        `  class name: ${this.constructor.name}`,
      ].join("\n"),
    )
  }
}
