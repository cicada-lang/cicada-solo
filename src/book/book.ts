import { FileStore } from "@enchanterjs/enchanter/lib/file-store"
import { customAlphabet } from "nanoid"
import { Ctx, CtxObserver, Highlighter } from "../lang/ctx"
import { Env } from "../lang/env"
import { Module } from "../module"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { CodeBlockResource } from "../module/code-block-resource"
import { BookConfig } from "./book-config"
import Path from "path"

const nanoid = customAlphabet("1234567890abcdef", 16)

export class Book<Files extends FileStore = FileStore> {
  config: BookConfig
  files: Files
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: BookConfig; files: Files }) {
    this.config = opts.config
    this.files = opts.files
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
      path: url.pathname,
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
