import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Exp from "../exp"

export function define(mod: Mod.Mod, top: Top.Top): void {
  switch (top.kind) {
    case "Top.def": {
      Mod.update(mod, top.name, top.exp)
      Exp.infer(mod, Ctx.init(), top.exp)
    }
  }
}
