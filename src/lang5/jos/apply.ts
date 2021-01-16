import { Jo } from "../jo"
import { World } from "../world"
import { PlaceholderValue, isPlaceholderValue } from "../values"

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

  if (isPlaceholderValue(value)) {
    return next.value_stack_push(value).application_trace_capture()
  }

  if (!value.apply) {
    throw new Error(`Expecting executable value`)
  }

  return value.apply(next)
}
