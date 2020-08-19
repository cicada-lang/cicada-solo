import * as Ty from "../ty"

export type Exp = v | fn | ap | zero | add1 | rec | suite | the

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

interface zero {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

interface add1 {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({ kind: "Exp.add1", prev })

interface rec {
  kind: "Exp.rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export const rec = (t: Ty.Ty, target: Exp, base: Exp, step: Exp): rec => ({
  kind: "Exp.rec",
  t,
  target,
  base,
  step,
})

interface the {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export const the = (t: Ty.Ty, exp: Exp): the => ({ kind: "Exp.the", t, exp })
