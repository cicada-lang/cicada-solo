import { World } from "../world"

export type Value = {
  apply?: (world: World) => World
  kind: string
  repr: () => string
  hash_repr?: () => string
}
