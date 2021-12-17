import pt from "@cicada-lang/partech"

const preserved = [
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
  "replace",
  "Absurd",
  "absurd_ind",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
