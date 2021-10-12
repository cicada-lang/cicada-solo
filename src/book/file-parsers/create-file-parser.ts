import * as FileParsers from "../file-parsers"
import { FileParser } from "../file-parser"

export function createFileParser(path: string): FileParser {
  if (path.endsWith(".cic")) {
    return new FileParsers.CicFileParser()
  } else if (path.endsWith(".md")) {
    return new FileParsers.MarkdownFileParser()
  } else {
    throw new Error(
      [
        `When try to create FileParser from path,`,
        `but I do not know how to handle file with this kind of extension:`,
        `  file: ${path}`,
      ].join("\n")
    )
  }
}
