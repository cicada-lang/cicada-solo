import ty from "@xieyuheng/ty"

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
