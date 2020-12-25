import { Value } from "../value"

export type StrValue = Value & {
  kind: "StrValue"
}

export const StrValue: StrValue = {
  kind: "StrValue"
}
