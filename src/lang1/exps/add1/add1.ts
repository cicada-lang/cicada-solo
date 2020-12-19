import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { add1_evaluable } from "./add1-evaluable"
import { add1_checkable } from "./add1-checkable"
import { Repr } from "../../repr"
import { nat_to_number } from "../../nat"

export type Add1 = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.add1"
    prev: Exp
  }

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
    ...add1_evaluable(prev),
    ...add1_checkable(prev),
    repr() {
      const n = nat_to_number(this)
      if (n !== undefined) {
        return n.toString()
      } else {
        return `add1(${prev.repr()})`
      }
    },
  }
}
