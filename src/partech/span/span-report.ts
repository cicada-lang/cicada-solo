import * as Span from "../span"
import * as ut from "../../ut"

export function report(span: Span.Span, context: string): string {
  let s = repr_in_context(span, context)
  s = decorate_line_number(s)
  s = line_span_focus(to_line_span_in_context(span, context), s, 3)
  return s
}

const color_mode: ut.ColorMode = ut.in_browser_p() ? "html" : "escape-code"

function repr_in_context(
  span: Span.Span,
  context: string,
  opts: {
    mode: ut.ColorMode
  } = {
    mode: color_mode,
  }
): string {
  let s = ""
  for (let i = 0; i < context.length; i++) {
    if (span.lo <= i && i < span.hi) {
      s += ut.color(context.charAt(i), { ...opts, background: "red" })
    } else {
      s += context.charAt(i)
    }
  }
  // NOTE END_OF_FILE
  if (span.lo === context.length && span.hi === context.length) {
    s += ut.color(" ", { ...opts, background: "red" })
  }
  return s
}

function decorate_line_number(text: string): string {
  let lines = text.split("\n")
  let max = lines.length + 1
  let width = max.toString().length
  let decorated = ""
  lines.forEach((line, i) => {
    let line_number = i // NOTE index from 0 instead of 1
    let line_number_string = line_number.toString()
    line_number_string =
      " ".repeat(width - line_number_string.length) + line_number_string
    decorated += " "
    decorated += line_number_string
    decorated += " |"
    decorated += line
    decorated += "\n"
  })
  return decorated
}

function to_line_span_in_context(span: Span.Span, context: string): Span.Span {
  let line_index_set = new Set<number>()
  let cursor = 0
  let lines = context.split("\n")
  for (let [i, line] of lines.entries()) {
    if (
      ut.interval_overlap_p(span.lo, span.hi, cursor, cursor + line.length + 1)
    ) {
      line_index_set.add(i)
    }
    cursor += line.length + 1
  }
  const lo = Math.min(...line_index_set)
  const hi = Math.max(...line_index_set)
  return { lo, hi }
}

function line_span_focus(
  span: Span.Span,
  context: string,
  margin: number
): string {
  let lines = context.split("\n")
  return lines.slice(Math.max(0, span.lo - margin), span.hi + margin).join("\n")
}
