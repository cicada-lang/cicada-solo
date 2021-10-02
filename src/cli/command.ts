export abstract class Command<Argv> {
  abstract signature: string
  abstract description: string
  abstract builder: any
  abstract handler(argv: Argv): Promise<void>
}
