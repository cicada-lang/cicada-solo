import pt from "@cicada-lang/partech"

export const identifier = pt.grammars.pattern_unless_preserved("identifier", [
  // keywords
  "let",
  "function",
  "return",
  "class",
  "import",
  "datatype",
  "induction",
  "check",
  // "same_as_chart",
  // built-in
  "car",
  "cdr",
])
