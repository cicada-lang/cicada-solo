import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_ap } from "../../evaluate"

export const ap_evaluable = (target: Exp, arg: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_ap(evaluate(env, target), evaluate(env, arg)),
  })
