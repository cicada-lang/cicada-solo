import * as CodeBlockParsers from "."
import { CodeBlockParser } from "../code-block-parser"

export function createCodeBlockParser(path: string): CodeBlockParser {
  if (path.endsWith(".cic")) {
    return new CodeBlockParsers.CicCodeBlockParser()
  } else if (path.endsWith(".md")) {
    return new CodeBlockParsers.MarkdownCodeBlockParser()
  } else if (path.startsWith("repl:")) {
    return new CodeBlockParsers.CicCodeBlockParser()
  } else {
    throw new Error(
      [
        `When try to create CodeBlockParser from path,`,
        `but I do not know how to handle file with this kind of extension:`,
        `  file: ${path}`,
      ].join("\n")
    )
  }
}
