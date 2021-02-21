import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Ctx from "../../ctx"
import * as Value from "../../value"
import * as Explain from "../../explain"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../trace"

export type AbsurdInd = Exp & {
  kind: "AbsurdInd"
  target: Exp
  motive: Exp
}

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "AbsurdInd",
    target,
    motive,
    evaluability: ({ env }) =>
      do_absurd_ind(evaluate(env, target), evaluate(env, motive)),
    ...Inferable({
      inferability: ({ ctx }) => {
        // NOTE the `motive` here is not a function from target_t to type,
        //   but a element of type.
        // NOTE We should always infer target,
        //   but we do a simple check for the simple absurd.
        check(ctx, target, Value.absurd)
        check(ctx, motive, Value.type)
        const motive_value = evaluate(Ctx.to_env(ctx), motive)
        return motive_value
      },
    }),
    repr: () => `Absurd.ind(${target.repr()}, ${motive.repr()})`,
    alpha_repr: (opts) =>
      `Absurd.ind(${target.alpha_repr(opts)}, ${motive.alpha_repr(opts)})`,
  }
}

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.absurd") {
      return Value.not_yet(
        motive,
        Neutral.absurd_ind(target.neutral, Normal.create(Value.type, motive))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
