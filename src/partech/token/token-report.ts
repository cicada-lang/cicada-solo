import * as Token from "../token"
import * as Span from "../span"
import * as ut from "../../ut"

export function report(token: Token.Token): string {
  const { label, value, span: { lo, hi } } = token
  return `the ${label} ${JSON.stringify(value)} at (${lo}, ${hi})`
}
