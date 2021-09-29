import ty from "@xieyuheng/ty"

export type FileResourceConfig = {
  name: string
  version: string
  src: string
}

export const fileResourceConfigSchema = ty.object<FileResourceConfig>({
  name: ty.string(),
  version: ty.semver(),
  src: ty.string(),
})
