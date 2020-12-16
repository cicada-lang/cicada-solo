import { Jo } from "../jo"
import { World } from "../world"

export type Goin = Jo & {
  name: string
}

export function Goin(name: string): Goin {
  return {
    name,
    composability: going_in(name),
    cuttability: going_in(name),
  }
}

const going_in = (name: string) => (world: World) => {
  const [value, next_world] = world.pop()
  return next_world.define(name, value)
}
