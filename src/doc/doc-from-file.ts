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

  if (path.endsWith(".cic")) {
    return new CicDoc({
      library,
      text,
      extension: extension_from_path(path),
      total_extension: total_extension_from_path(path),
    })
  }

  if (path.endsWith(".md")) {
    return new MdDoc({
      library,
      text,
      extension: extension_from_path(path),
      total_extension: total_extension_from_path(path),
    })
  }

  throw new Error(
    `When try to create doc from file, I met path with unknown ext: ${path}`
  )
}

function extension_from_path(path: string): string {
  const parts = path.split(".")
  if (parts.length === 0) {
    return ""
  }

  const extension = parts[parts.length - 1]
  return extension
}

function total_extension_from_path(path: string): string {
  const parts = path.split(".")
  if (parts.length === 0) {
    return ""
  }

  const total_extension = parts.slice(1).join(".")
  return total_extension
}
