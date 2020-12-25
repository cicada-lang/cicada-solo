import { Value } from "../value"

export type TypeValue = Value & {
  kind: "TypeValue"
}

export const TypeValue: TypeValue = {
  kind: "TypeValue",
}
