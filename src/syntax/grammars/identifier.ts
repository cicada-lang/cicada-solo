import * as pt from "../../partech"

const preserved = [
  "Pair",
  "cons",
  "car",
  "cdr",
  "Nat",
  "nat_ind",
  "zero",
  "add1",
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
