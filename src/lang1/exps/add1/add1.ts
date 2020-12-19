import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { add1_evaluable } from "./add1-evaluable"

export type Add1 = Evaluable & {
  kind: "Exp.add1"
  prev: Exp
}

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
    ...add1_evaluable(prev),
  }
}
