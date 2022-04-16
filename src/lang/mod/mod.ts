import { BlockResource } from "../block"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { ModLoader } from "../mod"
import { Value } from "../value"

export class Mod {
  loader: ModLoader
  blocks: BlockResource
  env: Env = Env.init()
  ctx: Ctx = Ctx.init()

  constructor(
    public url: URL,
    opts: { loader: ModLoader; blocks: BlockResource }
  ) {
    this.loader = opts.loader
    this.blocks = opts.blocks
  }

  async import(url: URL | string): Promise<Mod> {
    return await this.loader.loadAndExecute(
      typeof url === "string" ? this.resolve(url) : url
    )
  }

  resolve(href: string): URL {
    return new URL(href, this.url)
  }

  define(name: string, t: Value, value: Value): void {
    this.ctx.assertNotRedefine(name, t, value)
    this.ctx = this.ctx.extend(name, t, value)
    this.env = this.env.extend(name, value)
  }

  delete(name: string): void {
    this.ctx = this.ctx.remove(name)
    this.env = this.env.remove(name)
  }

  async execute(): Promise<void> {
    for (const block of this.blocks.all()) {
      await block.execute(this)
    }
  }
}
