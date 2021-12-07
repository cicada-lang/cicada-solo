import pt from "@cicada-lang/partech"

const preserved = [
  // stmts
  "let",
  "function",
  "return",
  "class",
  "import",
  "datatype",
  // keywords
  "induction",
  "the",
  "is",
  // built-in
  "Pair",
  "car",
  "cdr",
  "Equal",
  "refl",
  "same",
  "the_same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "absurd_ind",
  "String",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
