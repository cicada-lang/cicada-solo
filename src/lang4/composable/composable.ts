import { World } from "../world"

export type Composable = {
  composability: (worlds: Array<World>) => Array<World>
}
