import { BlockParser, BlockResource } from "../block"

type Route = {
  recognise: (url: URL) => boolean
  parser: BlockParser
}

export class BlockLoader {
  routes: Array<Route> = []
  fallbackParser?: BlockParser

  load(url: URL, text: string): BlockResource {
    for (const route of this.routes) {
      if (route.recognise(url)) {
        return route.parser.parseBlocks(text)
      }
    }

    if (this.fallbackParser) {
      return this.fallbackParser.parseBlocks(text)
    }

    throw new Error(`I can not handle url: ${url}`)
  }

  route(recognise: (url: URL) => boolean, parser: BlockParser): this {
    this.routes.push({ recognise, parser })
    return this
  }

  fallback(parser: BlockParser): this {
    this.fallbackParser = parser
    return this
  }
}
