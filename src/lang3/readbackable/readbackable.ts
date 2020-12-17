import { Exp } from "../exp"
import { Value } from "../value"
import { Mod } from "../mod"
import { Ctx } from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export type Readbackable = {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}

export function Readbackable(the: {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}): Readbackable {
  return the
}

export function ReadbackAsType(the: {
  readback_as_type: (the: { mod: Mod; ctx: Ctx }) => Exp
}): Readbackable {
  return {
    readbackability: (t, { mod, ctx }) => {
      if (t.kind === "Value.type") {
        return the.readback_as_type({ mod, ctx })
      }
      throw new Trace.Trace(
        `Expecting t to be Value.type\n` + `- t: ${ut.inspect(t)}\n`
      )
    },
  }
}
