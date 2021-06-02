import pt from "@cicada-lang/partech"

const preserved = [
  // stmts
  "def",
  "class",
  "import",
  // keywords
  "let",
  "the",
  // built-in
  "cons",
  "car",
  "cdr",
  "Nat",
  "nat_ind",
  "nat_rec",
  "zero",
  "add1",
  "List",
  "nil",
  "li",
  "list_ind",
  "list_rec",
  "Vector",
  "vecnil",
  "vec",
  "vector_head",
  "vector_tail",
  "vector_ind",
  "Equal",
  "same",
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
