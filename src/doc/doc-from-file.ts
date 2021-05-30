import { Doc, CicDoc, MdDoc } from "../doc"
import { Library } from "../library"

export function doc_ext_p(path: string): boolean {
  return path.endsWith(".cic") || path.endsWith(".md")
}

export function doc_from_file(opts: {
  path: string
  text: string
  library: Library
}): Doc {
  const { path, text, library } = opts

  if (path.endsWith(".cic")) return new CicDoc({ library, text })
  if (path.endsWith(".md")) return new MdDoc({ library, text })

  throw new Error(
    `When try to create doc from file, I met path with unknown ext: ${path}`
  )
}
