import app from "./web-app"
import * as ut from "../ut"
import * as CodeBlockParsers from "../module/code-block-parsers"
import * as Loggers from "@enchanterjs/enchanter/lib/loggers"
import { GitPath } from "@enchanterjs/enchanter/lib/git-path"

ut.test("git book", async () => {
  const logger = new Loggers.PrettyLogger()
  const url =
    "https://gitlab.com/cicada-lang/cicada/-/tree/master/books/the-little-typer-exercises"
  const book = await app.gitBooks.get(url)
  for (const path of await book.files.keys()) {
    if (
      CodeBlockParsers.canHandle(path) &&
      !path.endsWith(".error.md") &&
      !path.endsWith(".error.cic")
    ) {
      const t0 = Date.now()
      const file = await book.files.getOrFail(path)
      const mod = book.load(path, file, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })
      await mod.runAll()
      const t1 = Date.now()

      logger.info({
        tag: "check",
        elapse: t1 - t0,
        msg: path,
      })

      if (mod.formatAllOutputs()) {
        console.log(mod.formatAllOutputs())
      }
    }
  }
})

ut.test("git article", async () => {
  const logger = new Loggers.PrettyLogger()
  const url =
    "https://gitlab.com/cicada-lang/cicada/-/tree/master/books/the-little-typer-exercises"
  const path = "article.cic"
  const book = await app.gitBooks.fake({
    fallback: GitPath.fromURL(url).createGitFileStore(),
    faked: { [path]: "123" },
  })

  const t0 = Date.now()
  const file = await book.files.getOrFail(path)
  const mod = book.load(path, file, {
    observers: app.defaultCtxObservers,
    highlighter: app.defaultHighlighter,
  })
  await mod.runAll()
  const t1 = Date.now()

  logger.info({
    tag: "check",
    elapse: t1 - t0,
    msg: path,
  })

  if (mod.formatAllOutputs()) {
    console.log(mod.formatAllOutputs())
  }
})
