import { World } from "../world"

export type Jo = {
  compose: (world: World) => World
  cut: (world: World) => World
}
