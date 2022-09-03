import ty from "@xieyuheng/ty"

type Author = string | { name: string; username: string }

export interface BookConfig {
  title: string
  subtitle?: string
  version: string
  src?: string
  authors?: Array<Author>
  date?: string
}

const AuthorSchema = ty.union(
  ty.string(),
  ty.object({
    name: ty.string(),
    username: ty.string(),
  }),
)

export const BookConfigSchema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.optional(ty.string()),
  authors: ty.optional(ty.array(AuthorSchema)),
  date: ty.optional(ty.string()),
})
