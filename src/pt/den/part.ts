import * as Exp from "../exp"

export type Part = exp | bind

interface exp {
  kind: "Part.exp"
  value: Exp.Exp
}

export const exp = (value: Exp.Exp): exp => ({
  kind: "Part.exp",
  value,
})

interface bind {
  kind: "Part.bind"
  name: string
  value: Exp.Exp
}

export const bind = (name: string, value: Exp.Exp): bind => ({
  kind: "Part.bind",
  name,
  value,
})
