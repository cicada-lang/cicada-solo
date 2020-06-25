import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  switch (exp.kind) {
    case "Exp.Var": {
      // a = lookup(x, ctx)
      // ---------------------
      // ctx |- x => a
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Exp.Trace.Trace(exp, `Unknown variable name: ${exp.name}.\n`)
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
          throw new Error(
            `expecting rator_t to be Ty.Arrow instead of: ${rator_t}\n`
          ) // TODO
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
          throw new Error(
            `expecting target_t to be Ty.Nat instead of: ${target_t}\n`
          ) // TODO
        }
      }
    }

    default: {
      throw new Error()
    }
  }
}
