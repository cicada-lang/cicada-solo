import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function run(mod: Mod.Mod, tops: Array<Top.Top>): void {
  define(mod, tops)
  check(mod, tops)
  show(mod, tops)
}

function define(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    switch (top.kind) {
      case "Top.def": {
        if (top.exp.kind === "Exp.the") {
          Mod.update(mod, top.name, top)
        } else {
          Mod.update(mod, top.name, { exp: top.exp })
        }
      }
    }
  }
}

function check(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    switch (top.kind) {
      case "Top.def": {
        const t = Mod.lookup_type(mod, top.name)
        if (t === undefined) throw new Error(`undefined name: ${top.name}`)
        const ctx = Ctx.extend(Ctx.init(), top.name, t)
        Exp.check(mod, ctx, top.exp, t)
      }
    }
  }
}

function show(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
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
}
