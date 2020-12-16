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
  // return next_world.push()
  return next_world
  // TODO
  // world.value_stack.pop()
  // const value = world.env.lookup(name)
  // if (value === undefined) throw new Error(`undefined name ${name}`)
  // return value.comeout(world)
}
