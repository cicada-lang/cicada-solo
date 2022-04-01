import { Fetcher } from "../../infra/fetcher"
import { readURL } from "../../ut/node/url"
import { BlockResource } from "../block"
import * as BlockParsers from "../block/block-parsers"
import { Ctx } from "../ctx"
import { Env } from "../env"
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

  deleteCachedMod(url: URL): boolean {
    return this.cache.delete(url.href)
  }

  getCachedMod(url: URL): Mod | undefined {
    return this.cache.get(url.href)
  }

  setCachedMod(url: URL, mod: Mod): Map<string, Mod> {
    return this.cache.set(url.href, mod)
  }

  async load(url: URL): Promise<Mod> {
    const cached = this.getCachedMod(url)
    if (cached) {
      return cached
    }

    const text = await this.fileFetcher.fetch(url)

    const parser = BlockParsers.createBlockParser(url)

    const mod = new Mod({
      url: url,
      loader: this,
      blocks: new BlockResource(parser.parseBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init(),
    })

    this.setCachedMod(url, mod)
    return mod
  }
}
