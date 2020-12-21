import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_replace } from "../../evaluate"

export type Replace = Evaluable & {
  kind: "Exp.replace"
  target: Exp
  motive: Exp
  base: Exp
}

export function Replace(target: Exp, motive: Exp, base: Exp): Replace {
  return {
    kind: "Exp.replace",
    target,
    motive,
    base,
    evaluability: ({ env }) =>
      do_replace(
        evaluate(env, target),
        evaluate(env, motive),
        evaluate(env, base)
      ),
  }
}
