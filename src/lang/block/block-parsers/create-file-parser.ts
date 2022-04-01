import * as BlockParsers from "."
import { BlockParser } from "../block-parser"

export function createBlockParser(url: URL): BlockParser {
  if (url.protocol === "repl:") {
    return new BlockParsers.CicBlockParser()
  }

  if (url.pathname.endsWith(".cic")) {
    return new BlockParsers.CicBlockParser()
  }

  if (url.pathname.endsWith(".md")) {
    return new BlockParsers.MarkdownBlockParser()
  }

  throw new Error(
    [
      `When try to create BlockParser from url,`,
      `I meet unknown file extension:`,
      `  url: ${url}`,
    ].join("\n")
  )
}
