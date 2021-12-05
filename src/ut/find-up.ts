import fs from "fs"
import Path from "path"

export function findUp(
  file: string,
  opts?: { from?: string }
): string | undefined {
  const dir = opts?.from || process.cwd()
  return findUpFromDir(file, Path.resolve(dir))
}

const ROOT = Path.resolve("/")

export function findUpFromDir(file: string, dir: string): string | undefined {
  const result = Path.resolve(dir, file)
  if (fs.existsSync(result) && fs.lstatSync(result).isFile()) {
    return result
  } else if (dir === ROOT) {
    return undefined
  } else {
    return findUpFromDir(file, Path.dirname(dir))
  }
}
