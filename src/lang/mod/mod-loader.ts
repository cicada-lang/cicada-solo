import { Fetcher } from "../../infra/fetcher"
import { readURL } from "../../ut/node/url"
import { BlockResource } from "../block"
import * as BlockParsers from "../block/block-parsers"
import { Mod } from "../mod"

interface FileFetcher {
  fetch(url: URL): Promise<string>
}

export class ModLoader {
  cache: Map<string, Mod> = new Map()
  fetcher: Fetcher
  fileFetcher: FileFetcher

  constructor(options?: { fetcher?: Fetcher; fileFetcher?: FileFetcher }) {
    this.fetcher = options?.fetcher || new Fetcher()
    this.fileFetcher = options?.fileFetcher || { fetch: readURL }
  }

  async load(url: URL): Promise<Mod> {
    const cached = this.cache.get(url.href)
    if (cached) {
      return cached
    }

    const text = await this.fileFetcher.fetch(url)

    const parser = BlockParsers.createBlockParser(url)

    const mod = new Mod(url, {
      loader: this,
      blocks: new BlockResource(parser.parseBlocks(text)),
    })

    this.cache.set(url.href, mod)
    return mod
  }
}
