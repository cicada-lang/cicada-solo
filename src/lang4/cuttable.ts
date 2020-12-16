import { World } from "./world"

export type Cuttable = {
  cuttability: (worlds: Array<World>) => Array<World>
}
