import { World } from "../world"

export type Stmt = {
  kind: string
  execute(world: World): World
}
