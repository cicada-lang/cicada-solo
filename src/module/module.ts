import { World } from "../world"

export class Module {
  world: World

  constructor(opts: { world: World }) {
    this.world = opts.world
  }
}
