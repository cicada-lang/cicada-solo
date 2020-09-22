import * as Span from "../span"

export interface Token {
  kind: string
  value: string
  span: Span.Span
}
