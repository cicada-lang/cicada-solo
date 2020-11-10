import * as pt from "../../../partech"

const preserved = [
  "Pair",
  "cons",
  "car",
  "cdr",
  "Nat",
  "zero",
  "add1",
  "Equal",
  "same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "String",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
