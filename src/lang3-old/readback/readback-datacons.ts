import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function readback_datacons(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  datacons: Value.datacons
): Exp.dot {
  return Exp.dot(Exp.v(datacons.typecons.name), datacons.tag)
}
