import ty, { Schema } from "@xieyuheng/ty"

export type LibraryConfig = {
  name: string
  version: string
  src: string
}

export const libraryConfigSchema: Schema<LibraryConfig> = ty.object({
  name: ty.string(),
  version: ty.semver(),
  src: ty.string(),
})
