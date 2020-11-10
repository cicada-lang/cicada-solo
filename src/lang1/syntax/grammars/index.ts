import * as pt from "../../../partech"

export const zero_or_more = pt.grammars.zero_or_more
export const one_or_more = pt.grammars.one_or_more
export const dashline = pt.grammars.dashline

const preserved = ["zero", "add1", "rec"]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)

export * from "./exp"
export * from "./ty"
export * from "./stmt"
