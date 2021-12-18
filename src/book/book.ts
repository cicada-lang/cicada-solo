import { customAlphabet } from "nanoid"
import { Ctx, CtxObserver, Highlighter } from "../lang/ctx"
import { Env } from "../lang/env"
import { Module } from "../module"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { CodeBlockResource } from "../module/code-block-resource"
import { BookConfig } from "./book-config"

const nanoid = customAlphabet("1234567890abcdef", 16)

export class Book {
  config: BookConfig
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: BookConfig }) {
    this.config = opts.config
  }

  static fakeConfig(): BookConfig {
    return {
      title: `<fake-book-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    }
  }

  load(
    url: URL,
    text: string,
    opts: { observers: Array<CtxObserver>; highlighter: Highlighter }
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
