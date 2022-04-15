import { Fetcher } from "../../infra/fetcher"
import { BlockResource } from "../block"
import * as BlockParsers from "../block/block-parsers"
import { Mod } from "../mod"

export class ModLoader {
  cache: Map<string, Mod> = new Map()
  fetcher = new Fetcher()

  async load(url: URL): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found

    const code = await this.fetcher.fetch(url)
    const parser = BlockParsers.createBlockParser(url)
    const blocks = new BlockResource(parser.parseBlocks(code))
    const mod = new Mod(url, { loader: this, blocks })

    this.cache.set(url.href, mod)
    return mod
  }
}
