import { ReplEvent, ReplEventHandler } from "@enchanterjs/enchanter/lib/repl"
import { Config } from "../config"
import { Book } from "../book"
import { CtxObserver, Highlighter } from "../lang/ctx"
import * as StmtOutputs from "../lang/stmt/stmt-outputs"
import * as Errors from "../lang/errors"
import * as ut from "../ut"

export class AppReplEventHandler extends ReplEventHandler {
  config: Config
  book: Book
  path: string
  observers: Array<CtxObserver>
  highlighter: Highlighter

  constructor(opts: {
    config: Config
    book: Book
    path: string
    observers: Array<CtxObserver>
    highlighter: Highlighter
  }) {
    super()
    this.config = opts.config
    this.path = opts.path
    this.book = opts.book
    this.observers = opts.observers
    this.highlighter = opts.highlighter
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${this.config.pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<boolean> {
    const { text } = event
    return await this.execute(text)
  }

  private async execute(text: string): Promise<boolean> {
    text = text.trim()

    const mod = this.book.load(
      this.path,
      await this.book.files.getOrFail(this.path),
      { observers: this.observers, highlighter: this.highlighter }
    )

    try {
      const outputs = await mod.appendCodeBlock(text).runAll()
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.repr()
          const t = output.t.repr()
          console.log(`${ut.colors.yellow(exp)}: ${ut.colors.blue(t)}`)
        } else {
          console.log(output.repr().trim())
        }
      }
      return true
    } catch (error) {
      mod.codeBlocks.pop()

      const reporter = new Errors.ErrorReporter()
      const report = reporter.report(error, { text })
      if (report.trim()) {
        console.error(report.trim())
      }
      return false
    }
  }
}
