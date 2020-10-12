import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function subtype(mod: Mod.Mod, ctx: Ctx.Ctx, x: Value.Value, y: Value.Value): boolean {
  if (Value.conversion(mod, ctx, Value.type, x, y)) return true
  else if (x.kind === "Value.quote" && y.kind === "Value.str") return true
  else if (x.kind === "Value.union")
    return Value.subtype(mod, ctx, x.left, y) && Value.subtype(mod, ctx, x.right, y)
  else if (y.kind === "Value.union")
    return Value.subtype(mod, ctx, x, y.left) || Value.subtype(mod, ctx, x, y.right)
  else return false
}
