import Path from "path"
import fs from "fs"
import * as commonmark from "commonmark"

export const command = "md-play <file>"
export const description = "try .md file"

export const builder = {}

type Argv = {
  file: string
}

export const handler = async (argv: Argv) => {
  const { file } = argv
  const text = await fs.promises.readFile(file, "utf-8")

  const reader = new commonmark.Parser()
  const writer = new commonmark.HtmlRenderer()

  const parsed: commonmark.Node = reader.parse(text)

  {
    const walker = parsed.walker()

    let event, node
    while ((event = walker.next())) {
      node = event.node

      if (event.entering && node.type === "code_block") {
        // console.log(node.sourcepos)
        // console.log(node.literal)
        // console.log(node.info)
        if (node.literal) {
          node.literal = node.literal.toUpperCase()
        }
      }
    }
  }

  const result = writer.render(parsed)

  console.log(result)
}
