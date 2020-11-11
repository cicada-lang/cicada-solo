import * as Stmt from "../stmt"

export type Exp = v | fn | ap | begin

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
