import { World } from "../world"

export type Cuttable = {
  cuttability: (world: World) => World
}
