import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Evaluate from "../evaluate"
import * as Check from "../check"
import * as Infer from "../infer"
import * as Readback from "../readback"

export function run(mod: Mod.Mod, tops: Array<Top.Top>): string {
  define(mod, tops)
  check(mod, tops)
  return show(mod, tops)
}

function define(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    if (top.kind === "Top.def") {
      Mod.update(mod, top.name, { den: Mod.Den.def(top.exp, top.t) })
    }
    if (top.kind === "Top.type_constructor") {
      Mod.update(mod, top.type_constructor.name, {
        den: Mod.Den.type_constructor(top.type_constructor),
      })
    }
  }
}

function check(mod: Mod.Mod, tops: Array<Top.Top>): void {
  for (const top of tops) {
    if (top.kind === "Top.def") {
      const t = Mod.lookup_type(mod, top.name)!
      const ctx = Ctx.extend(Ctx.init(), top.name, t)
      Check.check(mod, ctx, top.exp, t)
    }
    if (top.kind === "Top.type_constructor") {
      Infer.infer(mod, Ctx.init(), top.type_constructor)
    }
  }
}

function show(mod: Mod.Mod, tops: Array<Top.Top>): string {
  let output = ""
  for (const top of tops) {
    if (top.kind === "Top.show") {
      const env = Env.init()
      const ctx = Ctx.init()
      const t = Infer.infer(mod, ctx, top.exp)
      const value = Evaluate.evaluate(mod, env, top.exp)
      const value_repr = Exp.repr(Readback.readback(mod, ctx, t, value))
      output += `${value_repr}\n`
    }
  }

  return output
}
