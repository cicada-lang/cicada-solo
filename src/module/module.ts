import { ModuleSource } from "../module"
import { World } from "../world"
import { Library } from "../library"

// NOTE
// - a module knows which library it belongs to
// - one file one module, loaded modules are cached
// - the loading order of files matters
// - no recursion

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
