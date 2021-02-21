import { Env } from "../env"
import { Ctx } from "../ctx"
import * as Value from "../value"
import { Checkable } from "../checkable"
import { readback } from "../readback"
import * as Trace from "../trace"
import * as ut from "../ut"

export type Inferable = {
  inferability: (the: { ctx: Ctx }) => Value.Value
}

export function Inferable(the: {
  inferability: (the: { ctx: Ctx }) => Value.Value
}): Inferable & Checkable {
  return {
    ...the,
    ...Checkable({
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
    }),
  }
}
