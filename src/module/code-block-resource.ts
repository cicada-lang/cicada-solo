import { CodeBlock } from "./code-block"
import { Parser } from "../lang/parser"
import { Stmt, StmtOutput } from "../lang/stmt"

export class CodeBlockResource {
  array: Array<CodeBlock> = []

  constructor(array: Array<CodeBlock>) {
    this.array = array
  }

  get length(): number {
    return this.array.length
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

  eraseOutputFrom(index: number): void {
    for (const [i, codeBlock] of this.array.entries()) {
      if (i >= index) {
        codeBlock.outputs = []
      }
    }
  }

  get allOutputs(): Array<StmtOutput> {
    return this.array.flatMap(({ outputs }) => outputs)
  }
}
