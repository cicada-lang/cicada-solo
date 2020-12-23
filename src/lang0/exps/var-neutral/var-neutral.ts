import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Names } from "../../readbackable"
import { Var } from "../var"

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
