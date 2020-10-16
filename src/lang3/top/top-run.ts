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
    if (top.kind === "Top.def") {
      Mod.update(mod, top.name, { den: Mod.Den.def(top.exp, top.t) })
    }
    if (top.kind === "Top.type_constructor") {
      Mod.update(mod, top.type_constructor.name, {
        den: Mod.Den.datatype(top.type_constructor),
      })
    }
  }
}

function check(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    if (top.kind === "Top.def") {
      const t = Mod.lookup_type(mod, top.name) as Value.Value
      const ctx = Ctx.extend(Ctx.init(), top.name, t)
      Exp.check(mod, ctx, top.exp, t)
    }
    if (top.kind === "Top.type_constructor") {
      const t = Mod.lookup_type(mod, top.type_constructor.name) as Value.Value
      const ctx = Ctx.extend(Ctx.init(), top.type_constructor.name, t)
      Exp.infer(mod, ctx, top.type_constructor)
    }
  }
}

function show(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    if (top.kind === "Top.show") {
      const env = Env.init()
      const ctx = Ctx.init()
      const t = Exp.infer(mod, ctx, top.exp)
      const value = Exp.evaluate(mod, env, top.exp)
      const value_repr = Exp.repr(Value.readback(mod, ctx, t, value))
      console.log(`${value_repr}`)
    }
  }
}
