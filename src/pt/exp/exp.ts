export type Exp = str | v | ap | gr

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
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

interface gr {
  kind: "Exp.gr"
  name: string
  choices: Array<Choice>
}

export const gr = (name: string, choices: Array<Choice>): gr => ({
  kind: "Exp.gr",
  name,
  choices,
})

interface Choice {
  name: string
  parts: Array<Part>
}

type Part = drop | pick

interface drop {
  kind: "Part.drop"
  value: Exp
}

interface pick {
  kind: "Part.pick"
  name: string
  value: Exp
}

export const part = {
  drop: (value: Exp): drop => ({
    kind: "Part.drop",
    value,
  }),

  pick: (name: string, value: Exp): pick => ({
    kind: "Part.pick",
    name,
    value,
  }),
}
