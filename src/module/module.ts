import ty from "@xieyuheng/ty"
import { Core, evaluate } from "../lang/core"
import { Ctx } from "../lang/ctx"
import { Env } from "../lang/env"
import { StmtOutput } from "../lang/stmt"
import { Value } from "../lang/value"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { CodeBlockResource } from "./code-block-resource"

export interface FileFetcher {
  fetch(url: URL): Promise<string>
}

export class Module {
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

  private static cache: Map<string, Module> = new Map()

  static deleteCachedMod(url: URL): boolean {
    return this.cache.delete(url.href)
  }

  static getCachedMod(url: URL): Module | undefined {
    return this.cache.get(url.href)
  }

  static setCachedMod(url: URL, mod: Module): Map<string, Module> {
    return this.cache.set(url.href, mod)
  }

  static async load(
    url: URL,
    opts: { fileFetcher: FileFetcher }
  ): Promise<Module> {
    const { fileFetcher } = opts

    const cached = Module.getCachedMod(url)
    if (cached) {
      return cached
    }

    const text = await fileFetcher.fetch(url)

    const parser = CodeBlockParsers.createCodeBlockParser(url)

    const mod = new Module({
      url: url,
      fileFetcher,
      codeBlocks: new CodeBlockResource(parser.parseCodeBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init(),
    })

    Module.setCachedMod(url, mod)
    return mod
  }

  async import(url: URL): Promise<Module> {
    return await Module.load(url, { fileFetcher: this.fileFetcher })
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
