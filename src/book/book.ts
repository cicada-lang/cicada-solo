import { FileStore } from "@enchanterjs/enchanter/lib/file-store"
import { customAlphabet } from "nanoid"
import { Ctx, CtxObserver, Highlighter } from "../lang/ctx"
import { Env } from "../lang/env"
import { Module } from "../module"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { CodeBlockResource } from "../module/code-block-resource"
import { BookConfig } from "./book-config"
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
    path: string,
    text: string,
    opts: { observers: Array<CtxObserver>; highlighter: Highlighter }
  ): Module {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const parser = CodeBlockParsers.createCodeBlockParser(path)

    const mod = new Module({
      book: this,
      path,
      codeBlocks: new CodeBlockResource(parser.parseCodeBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init({
        observers: opts.observers,
        highlighter: opts.highlighter,
      }),
    })

    this.cache.set(path, mod)
    return mod
  }
}
