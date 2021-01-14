import * as pt from "../../../partech"

const preserved: Array<string> = []

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
