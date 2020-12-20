import { Exp } from "../../exp"
import { Var } from "../var"
import { Names } from "../../readbackable"

export type VarNeutral = {
  kind: "Neutral.v"
  name: string
  readback_neutral: (the: { used: Names }) => Exp
}

export function VarNeutral(name: string): VarNeutral {
  return {
    kind: "Neutral.v",
    name,
    readback_neutral: ({ used }) => Var(name),
  }
}
