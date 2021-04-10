import { ModuleSource } from "../module"
import { World } from "../world"
import { Library } from "../library"

export class Module {
  world: World
  library: Library
  // source: ModuleSource

  constructor(opts: {
    world: World
    // source: ModuleSource;
    library: Library
  }) {
    this.world = opts.world
    this.library = opts.library
    // this.source = opts.source
  }
}
