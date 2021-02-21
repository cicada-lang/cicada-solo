import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Ctx from "../../ctx"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import { AlphaReprOpts } from "../../alpha-repr"
import * as ut from "../../../ut"

export type Let = Exp & {
  kind: "Let"
  name: string
  exp: Exp
  ret: Exp
}

export function Let(name: string, exp: Exp, ret: Exp): Let {
  return {
    kind: "Let",
    name,
    exp,
    ret,
    evaluability({ env }: { env: Env.Env }): Value {
      return evaluate(Env.update(env, name, evaluate(env, exp)), ret)
    },
    inferability({ ctx }: { ctx: Ctx.Ctx }): Value {
      return infer(
        Ctx.update(ctx, name, infer(ctx, exp), evaluate(Ctx.to_env(ctx), exp)),
        ret
      )
    },
    checkability(t: Value, { ctx }: { ctx: Ctx.Ctx }): void {
      check(
        Ctx.update(ctx, name, infer(ctx, exp), evaluate(Ctx.to_env(ctx), exp)),
        ret,
        t
      )
    },
    repr: () => {
      throw new Error("TODO")
    },
    alpha_repr: (opts) => {
      throw new Error("TODO")
    },
  }
}
