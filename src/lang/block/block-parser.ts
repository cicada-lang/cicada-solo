import { Block } from "../block"

export abstract class BlockParser {
  abstract parseBlocks(text: string): Array<Block>
}
