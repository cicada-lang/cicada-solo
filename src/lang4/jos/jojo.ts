import { Jo } from "../jo"

export type JoJo = Jo & {
  array: Array<Jo>
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    array,
    composability(worlds) {
      // TODO closure over env
      return worlds
    },
    cuttability(worlds) {
      // TODO closure over ctx
      return worlds
    },
  }
}
