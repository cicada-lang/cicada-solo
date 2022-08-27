import { Fetcher } from "../../framework/fetcher"
import { BlockLoader } from "../block"
import * as BlockParsers from "../block/block-parsers"
import { Mod } from "../mod"

export class ModLoader {
  cache: Map<string, Mod> = new Map()
  fetcher = new Fetcher()
  blockLoader = new BlockLoader()

  constructor() {
    this.blockLoader.route(
      (url) => url.href.endsWith(".md"),
      new BlockParsers.MarkdownBlockParser()
    )
    this.blockLoader.fallback(new BlockParsers.WholeBlockParser())
  }

  async load(url: URL): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found

    const code = await this.fetcher.fetch(url)
    const blocks = this.blockLoader.load(url, code)
    const mod = new Mod(url, { loader: this, blocks })

    this.cache.set(url.href, mod)
    return mod
  }

  async loadAndExecute(url: URL): Promise<Mod> {
    const mod = await this.load(url)
    await mod.execute()
    return mod
  }
}
