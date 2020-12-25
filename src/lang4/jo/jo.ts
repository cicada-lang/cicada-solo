import { World } from "../world"
import { Repr } from "../repr"

export type Jo = Repr & {
  compose: (world: World) => World
  cut: (world: World) => World
  kind: string
}
