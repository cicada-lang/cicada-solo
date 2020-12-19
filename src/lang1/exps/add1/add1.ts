import { Exp } from "../../exp"

export type Add1 = {
  kind: "Exp.add1"
  prev: Exp
}

export function Add1(prev: Exp): Add1 {
  return {
    kind: "Exp.add1",
    prev,
  }
}
