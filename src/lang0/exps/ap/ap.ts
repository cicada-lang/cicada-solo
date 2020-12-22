import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_ap } from "../../evaluate"
import { Repr } from "../../repr"
import * as Value from "../../value"

export type Ap = Exp & {
  kind: "Ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Ap",
    target,
    arg,
    ...Evaluable({
      evaluability: ({ env }) =>
        do_ap(evaluate(env, target), evaluate(env, arg)),
    }),
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}
