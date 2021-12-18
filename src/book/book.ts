import { Ctx, CtxObserver, Highlighter } from "../lang/ctx"
import { Env } from "../lang/env"
import { Module } from "../module"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { CodeBlockResource } from "../module/code-block-resource"

export class Book {
  cache: Map<string, Module>

  constructor(opts?: { cache?: Map<string, Module> }) {
    this.cache = opts?.cache || new Map()
  }

  load(
    url: URL,
    text: string,
    opts: {
      observers: Array<CtxObserver>
      highlighter: Highlighter
    }
  ): Module {
    const cached = this.cache.get(url.href)
    if (cached) {
      return cached
    }

    const parser = CodeBlockParsers.createCodeBlockParser(url.href)

    const mod = new Module({
      book: this,
      url: url,
      codeBlocks: new CodeBlockResource(parser.parseCodeBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init({
        observers: opts.observers,
        highlighter: opts.highlighter,
      }),
    })

    this.cache.set(url.href, mod)
    return mod
  }
}
