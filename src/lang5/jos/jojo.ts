import { Jo } from "../jo"
import { Value } from "../value"
import { World } from "../world"
import { JoJoValue } from "../values"

export type JoJo = Jo & {
  kind: "JoJo"
  jos: Array<Jo>
  jos_execute: (world: World) => World
  jos_repr: () => string
}

export function JoJo(jos: Array<Jo>): JoJo {
  return {
    kind: "JoJo",
    jos,
    execute(world) {
      return world.value_stack_push(
        JoJoValue(this, {
          env: world.env,
          mod: world.mod,
        })
      )
    },
    repr: () => "[ " + jos.map((jo) => jo.repr()).join(" ") + " ]",
    jos_execute: (world) => jos.reduce((world, jo) => jo.execute(world), world),
    jos_repr: () => jos.map((jo) => jo.repr()).join(" "),
  }
}
