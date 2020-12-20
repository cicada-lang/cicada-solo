import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Var } from "../var"
import { Names } from "../../readbackable"

export type VarNeutral = Neutral & {
  kind: "VarNeutral"
  name: string
}

export function VarNeutral(name: string): VarNeutral {
  return {
    kind: "VarNeutral",
    name,
    readback_neutral: ({ used }) => Var(name),
  }
}
