import { Value } from "../value"

export type SymValue = Value & {
  kind: "SymValue"
}

export const SymValue: SymValue = {
  kind: "SymValue",
  repr: () => "Symbol",
}
