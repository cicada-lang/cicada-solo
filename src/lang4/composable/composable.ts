import { World } from "../world"

export type Composable = {
  composability: (world: World) => World
}
