import path from "path"
import fs from "fs"

export async function write_json(
  obj: any,
  file: string | null | undefined
): Promise<void> {
  const text = JSON.stringify(obj, null, 2)
  if (file) {
    await fs.promises.mkdir(path.dirname(file), { recursive: true })
    await fs.promises.writeFile(file, text)
  } else {
    console.log(text)
  }
}
