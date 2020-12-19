import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { add1_evaluable } from "./add1-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"
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
    ...add1_evaluable(prev),
    repr() {
      const n = nat_to_number(this)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${repr(prev)})`
      }
    },
  }
}
