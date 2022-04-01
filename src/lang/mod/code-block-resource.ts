import { Ctx } from "../ctx"
import { Env } from "../env"
import { Parser } from "../parser"
import { StmtOutput } from "../stmt"
import { CodeBlock } from "./code-block"

export class CodeBlockResource {
  array: Array<CodeBlock> = []
  counter: number = 0
  backups: Array<{ env: Env; ctx: Ctx }> = []

  constructor(array: Array<CodeBlock>) {
    this.array = array
  }

  get length(): number {
    return this.array.length
  }

  next(backup: { env: Env; ctx: Ctx }): CodeBlock | undefined {
    this.backups.push(backup)
    return this.array[this.counter++]
  }

  nextOrFail(backup: { env: Env; ctx: Ctx }): CodeBlock {
    const codeBlock = this.next(backup)
    if (codeBlock === undefined) {
      throw new Error(`No more code blocks, length: ${this.length}`)
    }

    return codeBlock
  }

  finished(): boolean {
    return this.counter >= this.length
  }

  remain(): Array<CodeBlock> {
    return this.array.slice(this.counter)
  }

  encountered(id: number): boolean {
    const index = this.array.findIndex((codeBlock) => codeBlock.id === id)
    return index !== -1 && index < this.counter
  }

  backTo(id: number): { env: Env; ctx: Ctx } {
    if (!this.encountered(id)) {
      throw new Error(
        `I can not go back to id: ${id}, we have not encountered it yet.`
      )
    }

    const index = this.array.findIndex((codeBlock) => codeBlock.id === id)
    this.counter = index
    const backup = this.backups[index]
    this.backups = this.backups.slice(0, index)
    this.eraseOutputFrom(index)
    return backup
  }

  private eraseOutputFrom(index: number): void {
    for (const [i, codeBlock] of this.array.entries()) {
      if (i >= index) {
        codeBlock.outputs = []
      }
    }
  }

  nextId(): number {
    if (this.array.length === 0) return 0

    return Math.max(...this.array.map(({ id }) => id)) + 1
  }

  appendCode(code: string): void {
    const parser = new Parser()
    const stmts = parser.parse_stmts(code)
    const id = this.nextId()
    this.array.push(new CodeBlock({ id, code, stmts }))
  }

  get(id: number): CodeBlock | undefined {
    return this.array.find((codeBlock) => codeBlock.id === id)
  }

  getOrFail(id: number): CodeBlock {
    const codeBlock = this.get(id)
    if (codeBlock === undefined) {
      throw new Error(`Fail to get code block for id: ${id}`)
    }

    return codeBlock
  }

  has(id: number): boolean {
    return Boolean(this.get(id))
  }

  updateCode(id: number, code: string): void {
    const codeBlock = this.get(id)
    if (codeBlock) {
      codeBlock.updateCode(code)
    } else {
      console.warn(`I can not update non-existing code block of id: ${id}`)
    }
  }

  get allOutputs(): Array<StmtOutput> {
    return this.array.flatMap(({ outputs }) => outputs)
  }
}
