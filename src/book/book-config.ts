import ty from "@xieyuheng/ty"

export interface BookReference {
  host: string
  repo: string
  version: string
}

export interface BookConfig {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
  references?: Record<string, BookReference>
}

export const BookConfigSchema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.string(),
  authors: ty.optional(ty.array(ty.string())),
  date: ty.optional(ty.string()),
  references: ty.optional(
    ty.dict(
      ty.object({
        host: ty.string(),
        repo: ty.string(),
        version: ty.string(),
      })
    )
  ),
})
