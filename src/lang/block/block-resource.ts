import { Ctx } from "../ctx"
import { Env } from "../env"
import { Parser } from "../parser"
import { StmtOutput } from "../stmt"
import { Block } from "./block"

export class BlockResource {
  array: Array<Block> = []
  counter: number = 0
  backups: Array<{ env: Env; ctx: Ctx }> = []

  constructor(array: Array<Block>) {
    this.array = array
  }

  get length(): number {
    return this.array.length
  }

  next(backup: { env: Env; ctx: Ctx }): Block | undefined {
    this.backups.push(backup)
    return this.array[this.counter++]
  }

  nextOrFail(backup: { env: Env; ctx: Ctx }): Block {
    const block = this.next(backup)
    if (block === undefined) {
      throw new Error(`No more code blocks, length: ${this.length}`)
    }

    return block
  }

  finished(): boolean {
    return this.counter >= this.length
  }

  remain(): Array<Block> {
    return this.array.slice(this.counter)
  }

  encountered(id: number): boolean {
    const index = this.array.findIndex((block) => block.id === id)
    return index !== -1 && index < this.counter
  }

  backTo(id: number): { env: Env; ctx: Ctx } {
    if (!this.encountered(id)) {
      throw new Error(
        `I can not go back to id: ${id}, we have not encountered it yet.`
      )
    }

    const index = this.array.findIndex((block) => block.id === id)
    this.counter = index
    const backup = this.backups[index]
    this.backups = this.backups.slice(0, index)
    this.eraseOutputFrom(index)
    return backup
  }

  private eraseOutputFrom(index: number): void {
    for (const [i, block] of this.array.entries()) {
      if (i >= index) {
        for (const entry of block.entries) {
          delete entry.output
        }
      }
    }
  }

  nextId(): number {
    if (this.array.length === 0) return 0

    return Math.max(...this.array.map(({ id }) => id)) + 1
  }

  appendCode(code: string): void {
    const parser = new Parser()
    const stmts = parser.parseStmts(code)
    const id = this.nextId()
    this.array.push(
      new Block(
        id,
        code,
        stmts.map((stmt) => ({ stmt }))
      )
    )
  }

  get(id: number): Block | undefined {
    return this.array.find((block) => block.id === id)
  }

  getOrFail(id: number): Block {
    const block = this.get(id)
    if (block === undefined) {
      throw new Error(`Fail to get code block for id: ${id}`)
    }

    return block
  }

  has(id: number): boolean {
    return Boolean(this.get(id))
  }

  updateCode(id: number, code: string): void {
    const block = this.get(id)
    if (block) {
      block.updateCode(code)
    } else {
      console.warn(`I can not update non-existing code block of id: ${id}`)
    }
  }

  get allOutputs(): Array<undefined | StmtOutput> {
    return this.array.flatMap(({ outputs }) => outputs)
  }
}
