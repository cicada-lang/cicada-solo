import { Block, BlockEntry } from "../block"
import { StmtOutput } from "../stmt"

export class BlockResource {
  private blocks: Array<Block> = []
  counter: number = 0

  get length(): number {
    return this.blocks.length
  }

  last(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  put(
    id: number,
    code: string,
    info: string,
    entries: Array<BlockEntry>
  ): Block {
    const block = new Block(this, id, code, info, entries)
    this.blocks.push(block)
    return block
  }

  after(block: Block): Array<Block> {
    const index = this.blocks.findIndex(({ id }) => id === block.id)
    if (index === -1) return []
    return this.blocks.slice(index)
  }

  before(block: Block): Array<Block> {
    const index = this.blocks.findIndex(({ id }) => id === block.id)
    if (index === -1) return []
    return this.blocks.slice(0, index)
  }

  all(): Array<Block> {
    return this.blocks
  }

  get(id: number): Block | undefined {
    return this.blocks.find((block) => block.id === id)
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

  get outputs(): Array<undefined | StmtOutput> {
    return this.blocks.flatMap(({ outputs }) => outputs)
  }

  private nextId(): number {
    if (this.blocks.length === 0) return 0
    return Math.max(...this.blocks.map(({ id }) => id)) + 1
  }

  create(info: string): Block {
    const id = this.nextId()
    const block = new Block(this, id, "", info, [])
    this.blocks.push(block)
    return block
  }
}
