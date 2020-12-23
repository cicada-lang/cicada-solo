import { Jo } from "../jo"
import { World } from "../world"
import { JoJoComposeValue } from "../values/jojo-compose-value"
import { JoJoCutValue } from "../values/jojo-cut-value"

export type JoJo = Jo & {
  array: Array<Jo>
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    array,
    compose: (world) =>
      world.push(
        JoJoComposeValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
    cut: (world) =>
      world.push(
        JoJoCutValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
  }
}
