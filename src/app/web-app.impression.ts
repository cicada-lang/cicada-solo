import app from "./web-app"
import * as ut from "../ut"
import * as CodeBlockParsers from "../module/code-block-parsers"
import * as Loggers from "@xieyuheng/enchanter/lib/loggers"
import { GitPath } from "@xieyuheng/enchanter/lib/git-path"

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
      const mod = await book.load(path, {
        observers: app.defaultCtxObservers,
      })
      await mod.run_to_the_end()
      const t1 = Date.now()

      logger.info({
        tag: "check",
        elapse: t1 - t0,
        msg: path,
      })

      if (mod.all_output) {
        console.log(mod.all_output)
      }
    }
  }
})

ut.test("git article", async () => {
  const logger = new Loggers.PrettyLogger()
  const url =
    "https://gitlab.com/cicada-lang/cicada/-/tree/master/books/the-little-typer-exercises"
  const path = "article.cic"
  const book = await app.gitBooks.fakeFromGitPath(GitPath.fromURL(url), {
    [path]: "123",
  })

  const t0 = Date.now()
  const mod = await book.load(path, {
    observers: app.defaultCtxObservers,
  })
  await mod.run_to_the_end()
  const t1 = Date.now()

  logger.info({
    tag: "check",
    elapse: t1 - t0,
    msg: path,
  })

  if (mod.all_output) {
    console.log(mod.all_output)
  }
})
