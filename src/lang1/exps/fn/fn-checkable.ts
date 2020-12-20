import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import * as Ctx from "../../ctx"
import * as Ty from "../../ty"
import { Arrow } from "../../exps/arrow"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const fn_checkable = (name: string, ret: Exp) =>
  Checkable({
    checkability(t, { ctx }) {
      if (t.kind === "Arrow") {
        const arrow = t as Arrow
        const ctx_new = Ctx.clone(ctx)
        Ctx.update(ctx_new, name, arrow.arg_t)
        check(ctx_new, ret, arrow.ret_t)
        return
      }
      throw new Trace.Trace(
        ut.aline(`
          |When checking fn,
          |I am expecting the type to be Arrow,
          |but the given type is ${t.repr()}.
          |`)
      )
    },
  })
