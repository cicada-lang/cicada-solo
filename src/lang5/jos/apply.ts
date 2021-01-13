import { Jo } from "../jo"
import { World } from "../world"

export type Apply = Jo & {
  kind: "Apply"
}

export const Apply: Apply = {
  kind: "Apply",
  compose: apply,
  cut: apply,
  repr: () => `!`,
}

function apply(world: World): World {
  const [value, next] = world.value_stack_pop()
  if (value.apply) {
    return value.apply(next)
  } else {
    throw new Error(`Expecting executable value`)
  }
}
