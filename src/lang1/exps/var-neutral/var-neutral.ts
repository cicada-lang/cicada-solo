import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Var } from "../var"
import { Names } from "../../readbackable"

export type VarNeutral = Neutral & {
  kind: "Neutral.v"
  name: string
}

export function VarNeutral(name: string): VarNeutral {
  return {
    kind: "Neutral.v",
    name,
    readback_neutral: ({ used }) => Var(name),
  }
}
