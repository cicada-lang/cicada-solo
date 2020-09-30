import * as Token from "../token"
import * as Span from "../span"
import * as ut from "../../ut"

export function repr(token: Token.Token): string {
  const { label, value, span } = token
  return JSON.stringify([label, value, [span.lo, span.hi]])
}
