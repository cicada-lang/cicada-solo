import { Jo } from "../jo"
import { Value } from "../value"
import { World } from "../world"
import { JoJoComposeValue } from "../values/jojo-compose-value"
import { JoJoCutValue } from "../values/jojo-cut-value"

export type JoJo = Jo & {
  kind: "JoJo"
  array: Array<Jo>
  jos_compose: (world: World) => World
  jos_cut: (world: World) => World
  collect_values: () => Array<Value>
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    kind: "JoJo",
    array,
    compose(world) {
      return world.value_stack_push(
        JoJoComposeValue(this, {
          env: world.env,
          mod: world.mod,
        })
      )
    },
    cut(world) {
      return world.value_stack_push(
        JoJoCutValue(this, {
          env: world.env,
          mod: world.mod,
        })
      )
    },
    repr: () => "[ " + array.map((jo) => jo.repr()).join(" ") + " ]",
    jos_compose: (world) =>
      array.reduce((world, jo) => jo.compose(world), world),
    jos_cut: (world) => array.reduce((world, jo) => jo.cut(world), world),
    collect_values: () => {
      const world = World.init()
      // TODO
      return []
    }
  }
}
