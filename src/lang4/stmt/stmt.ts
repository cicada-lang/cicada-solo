import { World } from "../world"

export type Stmt = {
  assemble: (world: World) => World
  check: (world: World) => void
  output?: (world: World) => string
}
