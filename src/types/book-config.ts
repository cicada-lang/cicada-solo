import ty from "@xieyuheng/ty"

export interface BookConfig {
  title: string
  subtitle?: string
  version: string
  src?: string
  authors?: Array<string>
  date?: string
}

export const BookConfigSchema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.optional(ty.string()),
  authors: ty.optional(ty.array(ty.string())),
  date: ty.optional(ty.string()),
})
