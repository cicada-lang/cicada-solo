import { World } from "../world"
import { Repr } from "../repr"

export type Value = Repr & {
  refer?: (world: World) => World
  kind: string
}
