import * as Stmt from "../stmt"
import * as Ty from "../ty"

export type Exp = v | fn | ap | zero | add1 | rec | begin | the

type v = {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({ kind: "Exp.v", name })

type fn = {
  kind: "Exp.fn"
  name: string
  ret: Exp
}

export const fn = (name: string, ret: Exp): fn => ({
  kind: "Exp.fn",
  name,
  ret,
})

type ap = {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

type begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const begin = (stmts: Array<Stmt.Stmt>, ret: Exp): begin => ({
  kind: "Exp.begin",
  stmts,
  ret,
})

type zero = {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

type add1 = {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({ kind: "Exp.add1", prev })

type rec = {
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

type the = {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export const the = (t: Ty.Ty, exp: Exp): the => ({ kind: "Exp.the", t, exp })
