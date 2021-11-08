import ty from "@xieyuheng/ty"

export type BookConfig = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
}

export const bookConfigSchema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.string(),
  authors: ty.optional(ty.array(ty.string())),
  date: ty.optional(ty.string()),
})
