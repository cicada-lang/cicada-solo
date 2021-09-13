import { Doc } from "../doc"
import { Library, DocBuilder } from "../library"
import { CicDoc, MdDoc } from "../docs"
import { Module } from "../module"

export const doc_builder: DocBuilder = {
  right_extension_p(path: string): boolean {
    return path.endsWith(".cic") || path.endsWith(".md")
  },

  from_file(opts: { path: string; text: string }): Doc {
    const { path, text } = opts

    if (path.endsWith(".cic")) {
      return new CicDoc({ text, path })
    } else if (path.endsWith(".md")) {
      return new MdDoc({ text, path })
    } else {
      throw new Error(
        `When try to create doc from file, I met path with unknown ext: ${path}`
      )
    }
  },
}
