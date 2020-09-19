import * as Exp from "../exp"

export type Part = drop | pick

interface drop {
  kind: "Part.drop"
  value: Exp.Exp
}

export const drop = (value: Exp.Exp): drop => ({
  kind: "Part.drop",
  value,
})

interface pick {
  kind: "Part.pick"
  name: string
  value: Exp.Exp
}

export const pick = (name: string, value: Exp.Exp): pick => ({
  kind: "Part.pick",
  name,
  value,
})
