import { World } from "../world"

export type Stmt = {
  execute(world: World): Promise<void>
}
