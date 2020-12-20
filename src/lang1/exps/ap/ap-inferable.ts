import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { ArrowTy } from "../../exps/arrow-ty"
import { infer } from "../../infer"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const ap_inferable = (target: Exp, arg: Exp) =>
  Inferable({
    inferability: ({ ctx }) => {
      const target_t = infer(ctx, target)
      if (target_t.kind === "ArrowTy") {
        const arrow = target_t as ArrowTy
        check(ctx, arg, arrow.arg_t)
        return arrow.ret_t
      }
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the target_t to be ArrowTy,
          |but it is ${target_t.repr()}.
          |`)
      )
    },
  })
