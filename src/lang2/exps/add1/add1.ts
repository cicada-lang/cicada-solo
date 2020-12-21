import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"
import { Repr } from "../../repr"

import { nat_to_number } from "../../exp"

export type Add1 = Evaluable &
  Repr & {
    kind: "Exp.add1"
    prev: Exp
  }

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
    repr() {
      const n = nat_to_number(this)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${prev.repr()})`
      }
    },
    evaluability: ({ env }) => Value.add1(evaluate(env, prev)),
  }
}
