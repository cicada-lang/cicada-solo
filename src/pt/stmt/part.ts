import * as Sym from "../sym"

export type Part = sym | bind

interface sym {
  kind: "Part.sym"
  value: Sym.Sym
}

export const sym = (value: Sym.Sym): sym => ({
  kind: "Part.sym",
  value,
})

interface bind {
  kind: "Part.bind"
  name: string
  value: Sym.Sym
}

export const bind = (name: string, value: Sym.Sym): bind => ({
  kind: "Part.bind",
  name,
  value,
})
