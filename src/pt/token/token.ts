import * as Span from "../span"

export interface Token {
  label: string
  value: string
  span: Span.Span
}
