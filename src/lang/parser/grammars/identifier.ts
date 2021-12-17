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
  // built-in
  "car",
  "cdr",
])
