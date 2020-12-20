import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import * as Ctx from "../../ctx"
import { ArrowTy } from "../../exps/arrow-ty"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const fn_checkable = (name: string, ret: Exp) =>
  Checkable({
    checkability(t, { ctx }) {
      if (t.kind === "ArrowTy") {
        const arrow = t as ArrowTy
        const ctx_new = Ctx.clone(ctx)
        Ctx.update(ctx_new, name, arrow.arg_t)
        check(ctx_new, ret, arrow.ret_t)
        return
      }
      throw new Trace.Trace(
        ut.aline(`
          |When checking fn,
          |I am expecting the type to be ArrowTy,
          |but the given type is ${t.repr()}.
          |`)
      )
    },
  })
