import { Jo } from "../jo"
import { World } from "../world"
import { JoJoComposeValue } from "../values/jojo-compose-value"
import { JoJoCutValue } from "../values/jojo-cut-value"

export type JoJo = Jo & {
  kind: "JoJo"
  array: Array<Jo>
  compose_jojo: (world: World) => World
  cut_jojo: (world: World) => World
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    kind: "JoJo",
    array,
    compose: (world) =>
      world.value_stack_push(
        JoJoComposeValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
    cut: (world) =>
      world.value_stack_push(
        JoJoCutValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
    repr: () => "[ " + array.map((jo) => jo.repr()).join(" ") + "]",
    compose_jojo: (world) =>
      array.reduce((world, jo) => jo.compose(world), world),
    cut_jojo: (world) => array.reduce((world, jo) => jo.cut(world), world),
  }
}
