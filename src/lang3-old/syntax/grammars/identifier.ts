import * as pt from "../../../partech"

const preserved = [
  "Equal",
  "same",
  "replace",
  "Absurd",
  "String",
  "Type",
  "Object",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
