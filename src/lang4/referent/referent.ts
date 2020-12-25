import { World } from "../world"

export type Referent = {
  refer: (world: World) => World
}
