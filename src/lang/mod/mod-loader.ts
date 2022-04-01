import { Fetcher } from "../../infra/fetcher"
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

  constructor(options?: { fetcher?: Fetcher }) {
    this.fetcher = options?.fetcher || new Fetcher()
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

  async load(url: URL, opts: { fileFetcher: FileFetcher }): Promise<Mod> {
    const { fileFetcher } = opts

    const cached = Mod.getCachedMod(url)
    if (cached) {
      return cached
    }

    const text = await fileFetcher.fetch(url)

    const parser = BlockParsers.createBlockParser(url)

    const mod = new Mod({
      url: url,
      fileFetcher,
      blocks: new BlockResource(parser.parseBlocks(text)),
      env: Env.init(),
      ctx: Ctx.init(),
    })

    Mod.setCachedMod(url, mod)
    return mod
  }
}
