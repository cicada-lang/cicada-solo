import * as Sym from "./sym"

export type Stmt = gr | fn | token

interface gr {
  kind: "Stmt.gr"
  name: string
  // TODO
}

export const gr = (name: string): gr => ({
  kind: "Stmt.gr",
  name,
})

interface fn {
  kind: "Stmt.fn"
  name: string
  // TODO
}

export const fn = (name: string): fn => ({
  kind: "Stmt.fn",
  name,
})

interface token {
  kind: "Stmt.token"
  name: string
  pattern: string | RegExp
}

export const token = (name: string, pattern: string | RegExp): token => ({
  kind: "Stmt.token",
  name,
  pattern,
})
