import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { infer } from "../../infer"
import * as Value from "../../value"
import { evaluate } from "../../evaluate"
import * as Explain from "../../explain"
import * as Neutral from "../../neutral"
import * as Trace from "../../trace"

export type Car = Exp & {
  kind: "Car"
  target: Exp
}

export function Car(target: Exp): Car {
  return {
    kind: "Car",
    target,
    evaluability: ({ env }) => do_car(evaluate(env, target)),
    ...Inferable({
      inferability: ({ ctx }) => {
        const target_t = infer(ctx, target)
        const sigma = Value.is_sigma(ctx, target_t)
        return sigma.car_t
      },
    }),
    repr: () => `car(${target.repr()})`,
    alpha_repr: (opts) => `car(${target.alpha_repr(opts)})`,
  }
}

export function do_car(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.car
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.sigma") {
      return Value.not_yet(target.t.car_t, Neutral.car(target.neutral))
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "car",
          expecting: ["Value.sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "car",
        expecting: ["Value.cons", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
