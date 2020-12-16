import { Jo } from "../jo"

export type Var = Jo & {
  name: string
}

export function Var(name: string): Var {
  return {
    name,
    composability(possible_worlds) {
      return possible_worlds
    },
    cuttability(possible_worlds) {
      return possible_worlds
    },
  }
}
