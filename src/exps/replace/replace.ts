import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import * as Explain from "../../explain"
import { Env } from "../../env"
import * as Ctx from "../../ctx"
import * as Value from "../../value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../trace"
import { do_ap } from "../ap"
import { Pi } from "../pi"
import { Type } from "../type"
import { Var } from "../var"

export type Replace = Exp & {
  kind: "Replace"
  target: Exp
  motive: Exp
  base: Exp
}

export function Replace(target: Exp, motive: Exp, base: Exp): Replace {
  return {
    kind: "Replace",
    target,
    motive,
    base,
    evaluability: ({ env }) =>
      do_replace(
        evaluate(env, target),
        evaluate(env, motive),
        evaluate(env, base)
      ),
    ...Inferable({
      inferability: ({ ctx }) => {
        const target_t = infer(ctx, target)
        const equal = Value.is_equal(ctx, target_t)
        const motive_t = evaluate(
          Env.init().extend("t", equal.t),
          Pi("x", Var("t"), Type)
        )
        check(ctx, motive, motive_t)
        const motive_value = evaluate(Ctx.to_env(ctx), motive)
        check(ctx, base, do_ap(motive_value, equal.from))
        return do_ap(motive_value, equal.to)
      },
    }),
    repr: () => `replace(${target.repr()}, ${motive.repr()}, ${base.repr()})`,
    alpha_repr: (opts) =>
      `replace(${target.alpha_repr(opts)}, ${motive.alpha_repr(
        opts
      )}, ${base.alpha_repr(opts)})`,
  }
}

export function do_replace(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value
): Value.Value {
  if (target.kind === "Value.same") {
    return base
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.equal") {
      const base_t = do_ap(motive, target.t.from)
      const closure = Value.Closure.create(Env.init(), "x", Type)
      const motive_t = Value.pi(target.t.t, closure)
      return Value.not_yet(
        do_ap(motive, target.t.to),
        Neutral.replace(
          target.neutral,
          Normal.create(motive_t, motive),
          Normal.create(base_t, base)
        )
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "replace",
          expecting: ["Value.equal"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "replace",
        expecting: ["Value.same", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
