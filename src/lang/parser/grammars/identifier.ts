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
  "Nat",
  "nat_ind",
  "nat_rec",
  "zero",
  "add1",
  "Vector",
  "vecnil",
  "vec",
  "vector_head",
  "vector_tail",
  "vector_ind",
  "Equal",
  "refl",
  "same",
  "the_same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "absurd_ind",
  "Either",
  "inl",
  "inr",
  "either_ind",
  "String",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
