import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"
import * as Explain from "../../explain"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type AbsurdInd = Evaluable &
  Repr & {
    kind: "Exp.absurd_ind"
    target: Exp
    motive: Exp
  }

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "Exp.absurd_ind",
    target,
    motive,
    repr: () => `Absurd.ind(${repr(target)}, ${repr(motive)})`,
    evaluability: ({ env }) =>
      do_absurd_ind(evaluate(env, target), evaluate(env, motive)),
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
