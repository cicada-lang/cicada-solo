import * as Stmt from "../stmt"

export type Exp = v | fn | ap | suite

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({ kind: "Exp.v", name })

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
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

interface suite {
  kind: "Exp.suite"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const suite = (stmts: Array<Stmt.Stmt>, ret: Exp): suite => ({
  kind: "Exp.suite",
  stmts,
  ret,
})
