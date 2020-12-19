import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import * as Ty from "../../ty"
import { infer } from "../../infer"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const ap_inferable = (target: Exp, arg: Exp) =>
  Inferable({
    inferability: ({ ctx }) => {
      const target_t = infer(ctx, target)
      if (target_t.kind === "Ty.arrow") {
        check(ctx, arg, target_t.arg_t)
        return target_t.ret_t
      }
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the target_t to be Ty.arrow,
          |but it is ${Ty.repr(target_t)}.
          |`)
      )
    },
  })
