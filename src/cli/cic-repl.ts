import { ReadlineRepl, ReplEvent } from "../repls/readline-repl"
import { FakeFileResource } from "../library/file-resources"
import { Library } from "../library"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
const pkg = require("../../package.json")

export class CicRepl extends ReadlineRepl {
  files: FakeFileResource
  library: Library
  path: string

  constructor(opts: { dir: string }) {
    const { dir } = opts
    super()
    this.path = `repl-file-${nanoid()}.cic`
    this.files = new FakeFileResource({ dir, faked: { [this.path]: "" } })
    this.library = new Library({ files: this.files })
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${pkg.version} *^-^*/`)
  }

  async handle(event: ReplEvent): Promise<void> {
    const { text } = event
    await this.execute(text)
    this.files.faked[this.path] += text
  }

  private async execute(text: string): Promise<void> {
    const mod = await this.library.load(this.path)

    try {
      const output = await mod.append(text).run()
      console.log(output.trim())
    } catch (error) {
      const reporter = this.library.reporter
      const report = await reporter.error(error, this.path, { text })
      console.error(report.trim())
      mod.undo(mod.index)
    }
  }
}
