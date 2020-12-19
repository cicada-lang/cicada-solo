import { Checkable } from "../checkable"
import { Ctx } from "../ctx"
import * as Ty from "../ty"
import { infer } from "../infer"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export type Inferable = Checkable & {
  inferability: (the: { ctx: Ctx }) => Ty.Ty
}

export function Inferable(the: {
  inferability: (the: { ctx: Ctx }) => Ty.Ty
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
            |I infer the type to be ${Ty.repr(u)},
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      },
    }),
  }
}
