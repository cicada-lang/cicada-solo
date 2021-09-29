import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type LibraryConfig = {
  name: string
  version: string
  src: string
}

export const libraryConfigSchema = ty.object<LibraryConfig>({
  name: ty.string(),
  version: ty.semver(),
  src: ty.string(),
})

export function fake_library_config(): LibraryConfig {
  return libraryConfigSchema.validate({
    name: `<fake-library-${nanoid()}>`,
    version: "0.0.0",
    src: "src",
  })
}
