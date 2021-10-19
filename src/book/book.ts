import { Module } from "../module"
import * as CodeBlockParsers from "../module/code-block-parsers"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import { Env } from "../env"
import { Ctx, CtxOptions } from "../ctx"
import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type BookConfig = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
}

const book_config_schema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.string(),
  authors: ty.optional(ty.array(ty.string())),
  date: ty.optional(ty.string()),
})

export class Book<Files extends FileStore = FileStore> {
  config: BookConfig
  files: Files
  cache: Map<string, Module> = new Map()
  ctx: CtxOptions

  constructor(opts: { config: BookConfig; files: Files; ctx: CtxOptions }) {
    this.config = opts.config
    this.files = opts.files
    this.ctx = opts.ctx
  }

  static book_config_schema = book_config_schema

  static fake_config(): BookConfig {
    return book_config_schema.validate({
      title: `<fake-book-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    })
  }

  async load(path: string, opts?: { ctx?: CtxOptions }): Promise<Module> {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const parser = CodeBlockParsers.createCodeBlockParser(path)

    const text = await this.files.getOrFail(path)

    const mod = new Module({
      book: this,
      path,
      code_blocks: parser.parse_code_blocks(text),
      env: Env.init(),
      ctx: Ctx.init(opts?.ctx || this.ctx),
    })

    this.cache.set(path, mod)
    return mod
  }
}
