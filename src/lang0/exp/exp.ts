export type Exp = v | fn | ap | suite

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({ kind: "Exp.v", name })

interface fn {
  kind: "Exp.fn"
  name: string
  body: Exp
}

export const fn = (name: string, body: Exp): fn => ({
  kind: "Exp.fn",
  name,
  body,
})

interface ap {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

interface suite {
  kind: "Exp.suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}

export const suite = (
  defs: Array<{ name: string; exp: Exp }>,
  body: Exp
): suite => ({
  kind: "Exp.suite",
  defs,
  body,
})
