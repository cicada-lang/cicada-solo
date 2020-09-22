export type Exp = v | fn | ap | str | pattern | grammar

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
})

interface fn {
  kind: "Exp.fn"
  name: string
  ret: Exp
}

export const fn = (name: string, ret: Exp): fn => ({
  kind: "Exp.fn",
  name,
  ret,
})

interface ap {
  kind: "Exp.ap"
  target: Exp
  args: Array<Exp>
}

export const ap = (target: Exp, args: Array<Exp>): ap => ({
  kind: "Exp.ap",
  target,
  args,
})

interface str {
  kind: "Exp.str"
  value: string
}

export const str = (value: string): str => ({
  kind: "Exp.str",
  value,
})

interface pattern {
  kind: "Exp.pattern"
  label: string
  value: RegExp
}

export const pattern = (label: string, value: RegExp): pattern => ({
  kind: "Exp.pattern",
  label,
  value,
})

interface grammar {
  kind: "Exp.grammar"
  name: string
  choices: Map<string, Array<GrammarPart>>
}

export interface GrammarPart {
  name?: string
  value: Exp
}

export const grammar = (name: string, choices: Map<string, Array<GrammarPart>>): grammar => ({
  kind: "Exp.grammar",
  name,
  choices,
})
