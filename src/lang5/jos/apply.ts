import { Jo } from "../jo"
import { World } from "../world"

export type Apply = Jo & {
  kind: "Apply"
}

export const Apply: Apply = {
  kind: "Apply",
  execute: apply,
  repr: () => `!`,
}

export function apply(world: World): World {
  const [value, next] = world.value_stack_pop()

  if (!value.apply) {
    throw new Error(`Expecting executable value`)
  }

  return value.apply(next)
}
