import * as Span from "../span"

export function shift(span: Span.Span, offset: number): Span.Span {
  return {
    lo: span.lo + offset,
    hi: span.hi + offset,
  }
}
