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
  "absurd_ind",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
