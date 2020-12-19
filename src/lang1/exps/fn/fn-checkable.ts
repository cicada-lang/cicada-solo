import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import * as Ctx from "../../ctx"
import * as Ty from "../../ty"
import { check } from "../../check"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const fn_checkable = (name: string, ret: Exp) =>
  Checkable({
    checkability(t, { ctx }) {
      if (t.kind === "Ty.arrow") {
        const ctx_new = Ctx.clone(ctx)
        Ctx.update(ctx_new, name, t.arg_t)
        check(ctx_new, ret, t.ret_t)
        return
      }
      throw new Trace.Trace(
        ut.aline(`
          |When checking fn,
          |I am expecting the type to be Ty.arrow,
          |but the given type is ${Ty.repr(t)}.
          |`)
      )
    },
  })
