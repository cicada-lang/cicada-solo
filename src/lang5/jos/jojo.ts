import { Jo } from "../jo"
import { Value } from "../value"
import { World } from "../world"
import { JoJoComposeValue, JoJoCutValue } from "../values"

export type JoJo = Jo & {
  kind: "JoJo"
  jos: Array<Jo>
  jos_compose: (world: World) => World
  jos_cut: (world: World) => World
  jos_repr: () => string
  collect_values: () => Array<Value>
}

export function JoJo(jos: Array<Jo>): JoJo {
  return {
    kind: "JoJo",
    jos,
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
    repr: () => "[ " + jos.map((jo) => jo.repr()).join(" ") + " ]",
    jos_compose: jos_compose(jos),
    jos_cut: jos_cut(jos),
    jos_repr: () => jos.map((jo) => jo.repr()).join(" "),
    collect_values: () => {
      const world = jos_compose(jos)(World.init())
      return world.values
    },
  }
}

function jos_compose(jos: Array<Jo>): (world: World) => World {
  return (world) => jos.reduce((world, jo) => jo.compose(world), world)
}

function jos_cut(jos: Array<Jo>): (world: World) => World {
  return (world) => jos.reduce((world, jo) => jo.cut(world), world)
}
