import * as Choice from "./choice"

export type Den = gr | fn | token

interface gr {
  kind: "Den.gr"
  choices: Array<Choice.Choice>
}

export const gr = (choices: Array<Choice.Choice>): gr => ({
  kind: "Den.gr",
  choices,
})

interface fn {
  kind: "Den.fn"
  name: string
  choices: Array<Choice.Choice>
}

export const fn = (name: string, choices: Array<Choice.Choice>): fn => ({
  kind: "Den.fn",
  name,
  choices,
})

interface token {
  kind: "Den.token"
  pattern: string | RegExp
}

export const token = (pattern: string | RegExp): token => ({
  kind: "Den.token",
  pattern,
})
