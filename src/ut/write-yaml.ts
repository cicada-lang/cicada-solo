import YAML from "js-yaml"
import path from "path"
import fs from "fs"

export async function write_yaml(
  obj: any,
  file: string | null | undefined
): Promise<void> {
  const text = YAML.dump(obj)
  if (file) {
    await fs.promises.mkdir(path.dirname(file), { recursive: true })
    await fs.promises.writeFile(file, text)
  } else {
    console.log(text)
  }
}
