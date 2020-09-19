import * as Sym from "../sym"

export type Part = drop | pick

interface drop {
  kind: "Part.drop"
  value: Sym.Sym
}

export const drop = (value: Sym.Sym): drop => ({
  kind: "Part.drop",
  value,
})

interface pick {
  kind: "Part.pick"
  name: string
  value: Sym.Sym
}

export const pick = (name: string, value: Sym.Sym): pick => ({
  kind: "Part.pick",
  name,
  value,
})
