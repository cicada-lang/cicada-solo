import ty from "@xieyuheng/ty"
import { BlockResource } from "../block"
import * as BlockParsers from "../block/block-parsers"
import { Core, evaluate } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { StmtOutput } from "../stmt"
import { Value } from "../value"

export interface FileFetcher {
  fetch(url: URL): Promise<string>
}

export class Mod {
  url: URL
  fileFetcher: FileFetcher
  blocks: BlockResource
  env: Env
  ctx: Ctx

  constructor(opts: {
    url: URL
    fileFetcher: FileFetcher
    blocks: BlockResource
    env: Env
    ctx: Ctx
  }) {
    this.url = opts.url
    this.fileFetcher = opts.fileFetcher
    this.blocks = opts.blocks
    this.env = opts.env
    this.ctx = opts.ctx
  }

  private static cache: Map<string, Mod> = new Map()

  static deleteCachedMod(url: URL): boolean {
    return this.cache.delete(url.href)
  }

  static getCachedMod(url: URL): Mod | undefined {
    return this.cache.get(url.href)
  }

  static setCachedMod(url: URL, mod: Mod): Map<string, Mod> {
    return this.cache.set(url.href, mod)
  }

  static async load(
    url: URL,
    opts: { fileFetcher: FileFetcher }
  ): Promise<Mod> {
    const { fileFetcher } = opts

    const cached = Mod.getCachedMod(url)
    if (cached) {
      return cached
    }

    const text = await fileFetcher.fetch(url)

    const parser = BlockParsers.createBlockParser(url)

    const mod = new Mod({
      url: url,
      fileFetcher,
      blocks: new BlockResource(parser.parseBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init(),
    })

    Mod.setCachedMod(url, mod)
    return mod
  }

  async import(url: URL): Promise<Mod> {
    return await Mod.load(url, { fileFetcher: this.fileFetcher })
  }

  resolve(path: string): URL {
    return ty.uri().isValid(path) ? new URL(path) : new URL(path, this.url)
  }

  extendTypedCore(name: string, inferred: { t: Value; core: Core }): void {
    const inferred_value = evaluate(this.ctx.to_env(), inferred.core)
    this.ctx.assert_not_redefine(name, inferred.t, inferred_value)
    this.ctx = this.ctx.extend(name, inferred.t, inferred_value)
    this.env = this.env.extend(name, evaluate(this.env, inferred.core))
  }

  private async step(): Promise<Array<undefined | StmtOutput>> {
    const block = this.blocks.nextOrFail({ env: this.env, ctx: this.ctx })

    for (const entry of block.stmts) {
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
