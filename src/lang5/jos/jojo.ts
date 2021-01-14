import { Jo } from "../jo"
import { Value } from "../value"
import { World } from "../world"
import { JoJoValue } from "../values"

export type JoJo = Jo & {
  kind: "JoJo"
  jos: Array<Jo>
  jos_compose: (world: World) => World
  jos_repr: () => string
}

export function JoJo(jos: Array<Jo>): JoJo {
  return {
    kind: "JoJo",
    jos,
    compose(world) {
      return world.value_stack_push(
        JoJoValue(this, {
          env: world.env,
          mod: world.mod,
        })
      )
    },
    repr: () => "[ " + jos.map((jo) => jo.repr()).join(" ") + " ]",
    jos_compose: jos_compose(jos),
    jos_repr: () => jos.map((jo) => jo.repr()).join(" "),
  }
}

function jos_compose(jos: Array<Jo>): (world: World) => World {
  return (world) => jos.reduce((world, jo) => jo.compose(world), world)
}
