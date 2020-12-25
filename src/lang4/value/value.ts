import { World } from "../world"

export abstract class Value {
  refer(world: World): World {
    return world.push(this)
  }
}
