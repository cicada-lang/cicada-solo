import * as Stmt from "../stmt"

export type Exp =
  | v
  | pi
  | fn
  | ap
  | cls
  | fill
  | obj
  | dot
  | equal
  | same
  | replace
  | absurd
  | absurd_ind
  | str
  | quote
  | type
  | suite
  | the

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
})

interface pi {
  kind: "Exp.pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export const pi = (name: string, arg_t: Exp, ret_t: Exp): pi => ({
  kind: "Exp.pi",
  name,
  arg_t,
  ret_t,
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
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

interface cls {
  kind: "Exp.cls"
  scope: Array<{name: string, t: Exp}>
}

export const cls = (scope: Array<{name: string, t: Exp}>): cls => ({
  kind: "Exp.cls",
  scope,
})

interface fill {
  kind: "Exp.fill"
  target: Exp
  arg: Exp
}

export const fill = (target: Exp, arg: Exp): fill => ({
  kind: "Exp.fill",
  target,
  arg,
})

interface obj {
  kind: "Exp.obj"
  properties: Map<string, Exp>
}

export const obj = (properties: Map<string, Exp>): obj => ({
  kind: "Exp.obj",
  properties,
})

interface dot {
  kind: "Exp.dot"
  target: Exp
  name: string
}

export const dot = (target: Exp, name: string): dot => ({
  kind: "Exp.dot",
  target,
  name,
})

interface equal {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export const equal = (t: Exp, from: Exp, to: Exp): equal => ({
  kind: "Exp.equal",
  t,
  from,
  to,
})

interface same {
  kind: "Exp.same"
}

export const same: same = {
  kind: "Exp.same",
}

interface replace {
  kind: "Exp.replace"
  target: Exp
  motive: Exp
  base: Exp
}

export const replace = (target: Exp, motive: Exp, base: Exp): replace => ({
  kind: "Exp.replace",
  target,
  motive,
  base,
})

interface absurd {
  kind: "Exp.absurd"
}

export const absurd: absurd = {
  kind: "Exp.absurd",
}

interface absurd_ind {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export const absurd_ind = (target: Exp, motive: Exp): absurd_ind => ({
  kind: "Exp.absurd_ind",
  target,
  motive,
})

interface str {
  kind: "Exp.str"
}

export const str: str = {
  kind: "Exp.str",
}

interface quote {
  kind: "Exp.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Exp.quote",
  str,
})

interface type {
  kind: "Exp.type"
}

export const type: type = {
  kind: "Exp.type",
}

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

interface the {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export const the = (t: Exp, exp: Exp): the => ({
  kind: "Exp.the",
  t,
  exp,
})
