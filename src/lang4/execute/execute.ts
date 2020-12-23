import { World } from "../world"

export type Execute = {
  execute: (world: World) => World
}
