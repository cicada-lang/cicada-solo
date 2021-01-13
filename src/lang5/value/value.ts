import { World } from "../world"
import { Repr } from "../repr"

export type Value = Repr & {
  apply?: (world: World) => World
  kind: string
}
