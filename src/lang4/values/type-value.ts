import { Value } from "../value"
import { World } from "../world"

export type TypeValue = Value

export const TypeValue: TypeValue = {
  comeout: (world) =>
    World({
      ...world,
      value_stack: world.value_stack.push(TypeValue),
    }),
}
