import { Value } from "../value"
import { World } from "../world"

export type StrValue = Value

export const StrValue: StrValue = {
  comeout: (world) => world.push(StrValue),
}
