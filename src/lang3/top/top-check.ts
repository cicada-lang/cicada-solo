import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Check from "../check"
import * as Infer from "../infer"

export function check(mod: Mod.Mod, top: Top.Top): void {
  if (top.kind === "Top.def") {
    const t = Mod.lookup_type(mod, top.name)!
    const ctx = Ctx.extend(Ctx.init(), top.name, t)
    Check.check(mod, ctx, top.exp, t)
  }

  if (top.kind === "Top.type_constructor") {
    Infer.infer(mod, Ctx.init(), top.type_constructor)
  }
}
