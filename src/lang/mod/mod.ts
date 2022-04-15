import { BlockResource } from "../block"
import { Core, evaluate } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { ModLoader } from "../mod"
import { StmtOutput } from "../stmt"
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

  extendTypedCore(name: string, inferred: { t: Value; core: Core }): void {
    const inferred_value = evaluate(this.ctx.to_env(), inferred.core)
    this.ctx.assert_not_redefine(name, inferred.t, inferred_value)
    this.ctx = this.ctx.extend(name, inferred.t, inferred_value)
    this.env = this.env.extend(name, evaluate(this.env, inferred.core))
  }

  remove(name: string): void {
    this.ctx = this.ctx.remove(name)
    this.env = this.env.remove(name)
  }

  private async step(): Promise<Array<undefined | StmtOutput>> {
    const block = this.blocks.nextOrFail({ env: this.env, ctx: this.ctx })

    for (const entry of block.entries) {
      const output = await entry.stmt.execute(this)
      if (output) entry.output = output
    }

    return block.outputs
  }

  async runWithNewCode(
    id: number,
    code: string
  ): Promise<Array<undefined | StmtOutput>> {
    if (this.blocks.encountered(id)) {
      const backup = this.blocks.backTo(id)
      this.ctx = backup.ctx
      this.env = backup.env
    }

    this.blocks.updateCode(id, code)
    return await this.runTo(id)
  }

  async runTo(id: number): Promise<Array<undefined | StmtOutput>> {
    for (const block of this.blocks.remain()) {
      const outputs = await this.step()

      if (block.id === id) {
        return outputs
      }
    }

    throw new Error(`I can not find code block with id: ${id}`)
  }

  async runAll(): Promise<Array<undefined | StmtOutput>> {
    const outputs = []
    while (!this.blocks.finished()) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }
}
