import { World } from "../world"
import { Repr } from "../repr"

export type Value = Repr & {
  execute?: (world: World) => World
  kind: string
}
