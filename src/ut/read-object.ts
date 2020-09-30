import YAML from "js-yaml"
import fs from "fs"

export async function read_object(file: string): Promise<any> {
  const text = await fs.promises.readFile(file, "utf8")
  if (file.endsWith(".yaml")) {
    // NOTE about YAML.JSON_SCHEMA
    // 
    // https://yaml.org/spec/1.2/spec.html#id2803231
    return YAML.safeLoad(text, { schema: YAML.JSON_SCHEMA })
  } else if (file.endsWith(".json")) {
    return JSON.parse(text)
  } else {
    throw new Error(`Unknown file extension: ${file}.`)
  }
}
