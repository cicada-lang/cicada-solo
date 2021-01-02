import { Jo } from "../jo"
import { World } from "../world"

export type Execute = Jo & {
  kind: "Execute"
}

export const Execute: Execute = {
  kind: "Execute",
  compose: (world) => {
    const [value, next] = world.value_stack_pop()
    if (value.execute) {
      return value.execute(next)
    } else {
      throw new Error(`Expecting executable value`)
    }
  },
  cut: (world) => {
    const [value, next] = world.value_stack_pop()
    if (value.execute) {
      return value.execute(next)
    } else {
      throw new Error(`Expecting executable value`)
    }
  },
  repr: () => `!`,
}
