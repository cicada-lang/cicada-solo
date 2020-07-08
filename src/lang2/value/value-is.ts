import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"

export function isPi(ctx: Ctx.Ctx, value: Value.Value): Value.Pi {
  if (value.kind === "Value.Pi") {
    return value
  } else {
    throw new Trace.Trace(
      Value.unexpected(ctx, value, { message: `I am expecting the Type Pi.` })
    )
  }
}
