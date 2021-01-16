import { World } from "../world"

export type Value = {
  apply?: (world: World) => World
  kind: string
  repr: () => string
  semantic_repr: () => string
}
