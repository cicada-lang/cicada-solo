import axios from "axios"
import fs from "fs"
import Path from "path"

export async function readURL(url: URL): Promise<string> {
  switch (url.protocol) {
    case "http:":
    case "https:":
      return (await axios.get(url.href)).data
    case "file:":
      return await fs.promises.readFile(url.pathname, "utf8")
    case "repl:":
      return ""
    default:
      throw new Error(`I meet unknown protocol: ${url.protocol}`)
  }
}

export function formatURL(url: URL, opts?: { relative?: boolean }): string {
  if (url.protocol === "file:") {
    return opts?.relative
      ? Path.relative(process.cwd(), url.pathname)
      : url.pathname
  } else {
    return url.pathname
  }
}
