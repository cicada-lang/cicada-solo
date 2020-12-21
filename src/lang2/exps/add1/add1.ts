import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"

export type Add1 = Evaluable & {
  kind: "Exp.add1"
  prev: Exp
}

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
    evaluability: ({ env }) => Value.add1(evaluate(env, prev)),
  }
}
