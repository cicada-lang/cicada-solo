import * as pt from "../../../partech"

const preserved = ["zero", "add1", "rec"]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
