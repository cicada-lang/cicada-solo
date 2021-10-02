export abstract class Command<Argv> {
  abstract signature: string
  abstract description: string
  // NOTE The schema for options
  options: any = {}
  abstract execute(argv: Argv): Promise<void>
}
