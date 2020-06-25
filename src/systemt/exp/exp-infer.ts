import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  switch (exp.kind) {
    case "Exp.Var": {
      // a = lookup(x, ctx)
      // ---------------------
      // ctx |- x => a
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Exp.Trace.Trace(
          exp,
          ut.aline(`
              |I see variable ${exp.name} during infer,
              |but I can not find it in the environment.
              |`)
        )
      } else {
        return t
      }
    }

    case "Exp.Ap": {
      // ctx |- f => Arrow(a, b)
      // ctx |- e <= a
      // ---------------------
      // ctx |- Ap(f, e) => b
      const { rator, rand } = exp
      const rator_t = Exp.infer(ctx, rator)
      switch (rator_t.kind) {
        case "Ty.Arrow": {
          Exp.check(ctx, rand, rator_t.arg)
          return rator_t.ret
        }
        default: {
          throw new Exp.Trace.Trace(
            exp,
            ut.aline(`
              |I am expecting the rator_t to be Ty.Arrow,
              |but it is ${Ty.repr(rator_t)}.
              |`)
          )
        }
      }
    }

    case "Exp.NatRec": {
      // ctx |- n => Nat
      // ctx |- b <= t
      // ctx |- s <= Arrow(Nat, Arrow(t, t))
      // ------------------------------
      // ctx |- NatRec(t, n, b, s) => t
      const { t, target, base, step } = exp
      const target_t = Exp.infer(ctx, target)
      switch (target_t.kind) {
        case "Ty.Nat": {
          Exp.check(ctx, base, t)
          Exp.check(ctx, step, {
            kind: "Ty.Arrow",
            arg: { kind: "Ty.Nat" },
            ret: { kind: "Ty.Arrow", arg: t, ret: t },
          })
          return t
        }
        default: {
          throw new Exp.Trace.Trace(
            exp,
            ut.aline(`
              |I am expecting target_t to be Ty.Nat,
              |but it is ${Ty.repr(target_t)}.
              |`)
          )
        }
      }
    }

    default: {
      throw new Error()
    }
  }
}
