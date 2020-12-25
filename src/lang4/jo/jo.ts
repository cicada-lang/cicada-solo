import { World } from "../world"
import { Repr } from "../repr"

export type Jo = {
  compose: (world: World) => World
  cut: (world: World) => World
  kind: string
}
