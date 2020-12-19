import { Checkable } from "../checkable"
import { Ctx } from "../ctx"
import { Ty } from "../ty"
import { infer } from "../infer"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export type Inferable = Checkable & {
  inferability: (the: { ctx: Ctx }) => Ty
}

export function Inferable(the: {
  inferability: (the: { ctx: Ctx }) => Ty
}): Inferable {
  return {
    ...the,
    ...Checkable({
      checkability: (t, { ctx }) => {
        const u = the.inferability({ ctx })
        if (ut.equal(t, u)) {
          return
        }
        throw new Trace.Trace(
          ut.aline(`
            |I infer the type to be ${u.repr()},
            |but the given type is ${t.repr()}.
            |`)
        )
      },
    }),
  }
}
