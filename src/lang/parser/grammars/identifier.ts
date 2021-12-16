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
  "recursion",
  // built-in
  "car",
  "cdr",
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
