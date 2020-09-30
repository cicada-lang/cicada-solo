import fs from "fs"
import * as ut from "./index"

export type Format = "json" | "yaml"

export async function write_object(
  obj: any,
  file: string | null | undefined,
  opts: {
    format: Format
  } = {
    format: "json",
  }
): Promise<void> {
  if (file && file.endsWith(".json")) {
    return await ut.write_json(obj, file)
  } else if (file && file.endsWith(".yaml")) {
    return await ut.write_yaml(obj, file)
  } else {
    switch (opts.format) {
      case "json": {
        return await ut.write_json(obj, file)
      }
      case "yaml": {
        return await ut.write_yaml(obj, file)
      }
    }
  }
}
