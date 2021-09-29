import { ReplEvent, ReplEventHandler } from "../repl"
import { FakeFileResource } from "../file-resources"
import { Library, fakeLibraryConfig } from "../library"
import * as StmtOutputs from "../stmt-outputs"
import chalk from "chalk"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
const pkg = require("../../package.json")

export class CicReplEventHandler extends ReplEventHandler {
  files: FakeFileResource
  library: Library
  path: string

  constructor(opts: { dir: string }) {
    const { dir } = opts
    super()
    this.path = `repl-file-${nanoid()}.cic`
    this.files = new FakeFileResource({ dir, faked: { [this.path]: "" } })
    this.library = new Library({
      config: fakeLibraryConfig(),
      files: this.files,
    })
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
      const outputs = await mod.append(text).run()
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.repr()
          const t = output.t.repr()
          console.log(`${chalk.yellow(exp)}: ${chalk.blue(t)}`)
        } else {
          console.log(output.repr().trim())
        }
      }
    } catch (error) {
      mod.undo(mod.index)
      const reporter = this.library.reporter
      const report = await reporter.error(error, this.path, { text })
      if (report.trim()) {
        console.error(report.trim())
      }
    }
  }
}
