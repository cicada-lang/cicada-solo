import ty from "@xieyuheng/ty"
import { CodeBlockResource } from "../code-block"
import * as CodeBlockParsers from "../code-block/code-block-parsers"
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
  codeBlocks: CodeBlockResource
  env: Env
  ctx: Ctx

  constructor(opts: {
    url: URL
    fileFetcher: FileFetcher
    codeBlocks: CodeBlockResource
    env: Env
    ctx: Ctx
  }) {
    this.url = opts.url
    this.fileFetcher = opts.fileFetcher
    this.codeBlocks = opts.codeBlocks
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

    const parser = CodeBlockParsers.createCodeBlockParser(url)

    const mod = new Mod({
      url: url,
      fileFetcher,
      codeBlocks: new CodeBlockResource(parser.parseCodeBlocks(text)),
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

  private async step(): Promise<Array<StmtOutput>> {
    const outputs = []
    const codeBlock = this.codeBlocks.nextOrFail({
      env: this.env,
      ctx: this.ctx,
    })
    for (const stmt of codeBlock.stmts) {
      const output = await stmt.execute(this)
      if (output) {
        outputs.push(output)
      }
    }

    codeBlock.outputs = outputs
    return outputs
  }

  async runWithNewCode(id: number, code: string): Promise<Array<StmtOutput>> {
    if (this.codeBlocks.encountered(id)) {
      const backup = this.codeBlocks.backTo(id)
      this.ctx = backup.ctx
      this.env = backup.env
    }

    this.codeBlocks.updateCode(id, code)
    return await this.runTo(id)
  }

  async runTo(id: number): Promise<Array<StmtOutput>> {
    for (const codeBlock of this.codeBlocks.remain()) {
      const outputs = await this.step()

      if (codeBlock.id === id) {
        return outputs
      }
    }

    throw new Error(`I can not find code block with id: ${id}`)
  }

  async runAll(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (!this.codeBlocks.finished()) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }
}
