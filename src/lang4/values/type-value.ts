import { Value } from "../value"
import { World } from "../world"

export type TypeValue = Value

export const TypeValue: TypeValue = {
  comeout: (world) => world.value_stack_push(TypeValue),
}
