import * as Choice from "./choice"

export type Stmt = gr | fn | token

interface gr {
  kind: "Stmt.gr"
  name: string
  choices: Array<Choice.Choice>
}

export const gr = (name: string, choices: Array<Choice.Choice>): gr => ({
  kind: "Stmt.gr",
  name,
  choices,
})

interface fn {
  kind: "Stmt.fn"
  name: string
  arg_name: string
  choices: Array<Choice.Choice>
}

export const fn = (
  name: string,
  arg_name: string,
  choices: Array<Choice.Choice>
): fn => ({
  kind: "Stmt.fn",
  name,
  arg_name,
  choices,
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
