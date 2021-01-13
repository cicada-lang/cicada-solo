import * as pt from "../../../partech"

const preserved: Array<string> = ["Type", "String", "Symbol", "Number"]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
