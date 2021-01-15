import { World } from "../world"
import { Repr } from "../repr"

export type Jo = Repr & {
  execute: (world: World) => World
  kind: string
}
