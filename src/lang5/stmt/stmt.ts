import { World } from "../world"

export type Stmt = {
  assemble: (world: World) => World
  output?: (world: World) => string
}
