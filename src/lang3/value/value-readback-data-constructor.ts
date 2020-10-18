import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function readback_data_constructor(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  data_constructor: Value.data_constructor
): Exp.dot {
  return Exp.dot(
    Exp.v(data_constructor.type_constructor.name),
    data_constructor.tag
  )
}
