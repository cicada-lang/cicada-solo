import { World } from "../world"

export type Decl = {
  assemble: (world: World) => World
  check: (world: World) => void
  output?: (world: World) => string
}
