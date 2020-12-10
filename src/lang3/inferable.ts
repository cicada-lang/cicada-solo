import { Mod } from "./mod"
import { Env } from "./env"
import { Ctx } from "./ctx"
import { Exp } from "./exp"
import { Checkable } from "./checkable"
import * as Value from "./value"
import * as Infer from "./infer"
import * as Readback from "./readback"
import * as Trace from "../trace"
import * as ut from "../ut"

export type Inferable = {
  inferability(the: { mod: Mod; ctx: Ctx }): Value.Value
} & Checkable

export function Inferable(the: {
  inferability(the: { mod: Mod; ctx: Ctx }): Value.Value
}): Inferable {
  return {
    ...the,
    checkability: (t, { mod, ctx }) => {
      // TODO should use inferer
      // const u = Infer.infer(mod, ctx, exp)
      const u = the.inferability({ mod, ctx })
      if (!Value.subtype(mod, ctx, u, t)) {
        const u_repr = Readback.readback(mod, ctx, Value.type, u)
          .repr()
          .replace(/\s+/g, " ")
        const t_repr = Readback.readback(mod, ctx, Value.type, t)
          .repr()
          .replace(/\s+/g, " ")
        throw new Trace.Trace(
          ut.aline(`
        |I infer the type to be ${u_repr}.
        |But the given type is ${t_repr}.
        |`)
        )
      }
    },
  }
}
