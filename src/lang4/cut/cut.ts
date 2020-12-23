import { World } from "../world"

export type Cut = {
  cut: (world: World) => World
}
