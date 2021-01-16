import { World } from "../world"

export type Jo = {
  execute: (world: World) => World
  kind: string
  repr: () => string
}
