import * as CodeBlockParsers from "."
import { CodeBlockParser } from "../code-block-parser"

export function createCodeBlockParser(url: URL): CodeBlockParser {
  if (url.protocol === "repl:") {
    return new CodeBlockParsers.CicCodeBlockParser()
  }

  if (url.pathname.endsWith(".cic")) {
    return new CodeBlockParsers.CicCodeBlockParser()
  }

  if (url.pathname.endsWith(".md")) {
    return new CodeBlockParsers.MarkdownCodeBlockParser()
  }

  throw new Error(
    [
      `When try to create CodeBlockParser from url,`,
      `I meet unknown file extension:`,
      `  url: ${url}`,
    ].join("\n")
  )
}
