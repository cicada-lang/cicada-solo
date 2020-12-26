import { Value } from "../value"

export type NumValue = Value & {
  kind: "NumValue"
}

export const NumValue: NumValue = {
  kind: "NumValue",
  repr: () => "Number",
}
