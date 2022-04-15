import { BlockResource } from "../block"

export abstract class BlockParser {
  abstract parseBlocks(text: string): BlockResource
}
