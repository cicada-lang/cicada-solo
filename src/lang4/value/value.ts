import { World } from "../world"

export type Value = {
  refer?: (world: World) => World
  kind: string
}
