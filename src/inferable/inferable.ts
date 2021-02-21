import { Env } from "../env"
import { Ctx } from "../ctx"
import * as Value from "../value"
import { readback } from "../readback"
import * as Trace from "../trace"
import * as ut from "../ut"

export function Inferable(the: {
  inferability: (the: { ctx: Ctx }) => Value.Value
}): {
  inferability: (the: { ctx: Ctx }) => Value.Value
  checkability(t: Value.Value, the: { ctx: Ctx }): void
} {
  return {
    ...the,
    checkability: (t, { ctx }) => {
      const u = the.inferability({ ctx })
      if (!Value.conversion(ctx, Value.type, t, u)) {
        throw new Trace.Trace(
          ut.aline(`
              |I infer the type to be ${readback(ctx, Value.type, u).repr()}.
              |But the given type is ${readback(ctx, Value.type, t).repr()}.
              |`)
        )
      }
    },
  }
}
