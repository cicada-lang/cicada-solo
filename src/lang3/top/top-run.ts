import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function run(mod: Mod.Mod, top: Top.Top): void {
  Top.define(mod, top)

  switch (top.kind) {
    case "Top.show": {
      const env = Env.init()
      const ctx = Ctx.init()
      const t = Exp.infer(mod, ctx, top.exp)
      const value = Exp.evaluate(mod, env, top.exp)
      const value_repr = Exp.repr(Value.readback(mod, ctx, t, value))
      const t_repr = Exp.repr(Value.readback(mod, ctx, Value.type, t))
      console.log(`${t_repr} -- ${value_repr}`)
    }
  }
}
