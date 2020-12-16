import { Jo } from "../jo"

export type JoJo = Jo & {
  array: Array<Jo>
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    array,
    composability: (possible_worlds) => possible_worlds,
    cuttability: (possible_worlds) => possible_worlds,
  }
}
