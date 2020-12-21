import { Exp } from "../../exp"

export type Quote = {
  kind: "Exp.quote"
  str: string
}

export function Quote(str: string): Quote {
  return {
    kind: "Exp.quote",
    str,
  }
}
